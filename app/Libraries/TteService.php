<?php

namespace App\Libraries;

use Exception;
use GuzzleHttp\Client;
use OpenAPI\Client\Api\EsignApi;
use OpenAPI\Client\ApiException;
use OpenAPI\Client\Configuration;
use OpenAPI\Client\Model\EsignResultResults;

class TteService
{
    private EsignApi $http;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        if (empty(config('services.tte.base_url'))) {
            throw new Exception('TTE base url is not set');
        }

        if (empty(config('services.tte.api_key'))) {
            throw new Exception('TTE api key is not set');
        }

        $config = Configuration::getDefaultConfiguration()
            ->setHost(config('services.tte.base_url'))
            ->setApiKey('X-API-KEY', config('services.tte.api_key'));

        $client = new Client([
            'timeout' => config('services.tte.timeout'),
        ]);

        $this->http = new EsignApi($client, $config);
    }


    /**
     * @throws ApiException
     */
    public function verifyById($id): EsignResultResults
    {
        $response = $this->http->apiEsignVerifyIdGet($id);

        return $response->getResults();
    }

    /**
     * @throws ApiException
     */
    public function verifyByDoc($document): EsignResultResults
    {
        $response = $this->http->apiEsignVerifyDocPost($document);

        return $response->getResults();
    }
}
