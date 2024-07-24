<?php

namespace App\Libraries;

use App\Jobs\SendNotif;
use App\Models\Db1\SysUserFbtoken;
use App\Models\Db1\SysUserNotif;
use Google\Client;
use Google\Exception;
use GuzzleHttp\Exception\GuzzleException;

class Notification
{
    public string $title;
    public string $message;
    public string $clickAction;
    private int|string $userId;

    public function __construct(int|string $userId, $title = '', $message = '', $clickAction = null)
    {
        $this->title       = $title;
        $this->message     = $message;
        $this->clickAction = $clickAction ?? url('/');
        $this->userId      = $userId;
    }

    public function sendInBackground($debug = false): void
    {
        SendNotif::dispatch($this, $debug);
    }

    /**
     * @throws GuzzleException
     * @throws Exception
     */
    public function send($debug = false): void
    {
        if (!$debug) {
            $this->insertNotification();
        }
        $this->sendToFirebase();
    }

    private function insertNotification(): void
    {
        // Add to Notif System
        $notif          = new SysUserNotif();
        $notif->user_id = $this->userId;
        $notif->title   = $this->title;
        $notif->content = $this->message;
        $notif->link    = $this->clickAction;
        $notif->is_read = 'no';
        $notif->save();
    }

    /**
     * @throws Exception|GuzzleException
     */
    private function sendToFirebase(): void
    {
        $credentialJson = config('google.firebase.credentials_json');
        if (!file_exists($credentialJson)) return;

        $client = new Client();
        $client->setApplicationName(config('app.name'));
        $client->setAuthConfig($credentialJson);
        $client->addScope('https://www.googleapis.com/auth/firebase.messaging');

        $httpClient = $client->authorize();

        // Your Firebase project ID
        $project = config('google.firebase.project_name');

        // List Available Token
        $dataToken = SysUserFbtoken::with("sys_user")->where("user_id", $this->userId)->get()->toArray();
        if (empty($dataToken)) return;

        // Get Token
        $listToken = array_column($dataToken, 'token');
        if (count($listToken) == 0) return;

        $expiredToken = [];
        foreach ($listToken as $token) {
            // Creates a notification for subscribers to the debug topic
            $message = [
                "message" => [
                    "token"        => $token,
                    "notification" => [
                        'title' => $this->title,
                        'body'  => strip_tags($this->message),
                    ],
                    'data'         => [
                        'title'   => $this->title,
                        'body'    => strip_tags($this->message),
                        'vibrate' => '1',
                        'sound'   => '1',
                        'url'     => $this->clickAction,
                    ]
                ]
            ];

            // Send the Push Notification - use $response to inspect success or errors
            $response = $httpClient->post("https://fcm.googleapis.com/v1/projects/{$project}/messages:send", ['json' => $message]);
            $resBody  = $response->getBody()->getContents();

            $resBody = json_decode($resBody);

            if (isset($resBody->error)) {
                $expiredToken[] = $token;
            }
        }

        if (count($expiredToken) > 0) {
            SysUserFbtoken::whereIn('token', $expiredToken)->delete();
        }
    }
}
