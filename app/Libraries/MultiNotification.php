<?php

namespace App\Libraries;

use App\Enums\Option;
use App\Enums\PelangganJenisPelanggan;
use App\Models\Db1\SysUser;

class MultiNotification
{
    public function __construct(protected SysUser $user, protected $clickableUrl = '/') { }

    protected array $channels = [];

    public function buildPushNotification($title, $message): static
    {
        $this->channels[] = [
            'title'   => $title,
            'message' => $message,
            'type'    => 'push',
        ];
        return $this;
    }

    public function buildEmailNotification($subject, $body): static
    {
        $this->channels[] = [
            'subject' => $subject,
            'body'    => $body,
            'type'    => 'email',
        ];
        return $this;
    }

    public function buildWhatsapp($message): static
    {
        $this->channels[] = [
            'message' => $message,
            'type'    => 'whatsapp',
        ];
        return $this;
    }

    public function send(): void
    {
        foreach ($this->channels as $channel) {
            if ($channel['type'] === 'push') {
                $this->sendPushNotification($channel['title'], $channel['message']);
            } elseif ($channel['type'] === 'email') {
                $this->sendEmailNotification($channel['subject'], $channel['body']);
            } elseif ($channel['type'] === 'whatsapp') {
                $this->sendWhatsapp($channel['message']);
            }
        }
    }

    private function sendPushNotification($title, $message): void
    {
        $pushNotification = new Notification($this->user->id, $title, $message, $this->clickableUrl);
        $pushNotification->sendInBackground();
    }

    private function sendEmailNotification($subject, $body): void
    {
        $mailer = new Mailer();
        $mailer->subject($subject)
            ->to($this->user->email)
            ->body($body)
            ->sendInBackground();
    }

    private function sendWhatsapp($message): void
    {
        $waNumber = null;

        if ($this->user->isPegawai() && $this->user->pegawai->whatsapp_verified == Option::YES->value) {
            $waNumber = $this->user->pegawai->whatsapp;
        } else {
            $pelanggan      = $this->user->pelanggan;
            $detail         = $pelanggan->detail;
            $jenisPelanggan = $pelanggan->jenis_pelanggan;

            if ($jenisPelanggan == PelangganJenisPelanggan::PERORANGAN->value && $detail->whatsapp_verified == Option::YES->value) {
                $waNumber = $detail->whatsapp;
            } elseif (in_array($jenisPelanggan, [PelangganJenisPelanggan::BADAN_USAHA->value, PelangganJenisPelanggan::INSTANSI_PEMERINTAH->value]) &&
                $detail->pj_whatsapp_verified == Option::YES->value) {
                $waNumber = $detail->pj_whatsapp;
            }
        }

        if ($waNumber) {
            $message = $message . "\n\n" . $this->clickableUrl;
            WhatsappService::sendMessage($waNumber, $message)->sendInBackground();
        }
    }

}
