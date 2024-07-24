<?php

namespace App\Libraries;

use App\Jobs\SendEmail;
use App\Mail\RawMailable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class Mailer
{
    private array $attachments = [];
    private string $from;
    private string $fromName;
    private array $to = [];
    private array $cc = [];
    private string $subject;
    private string $body;
    private string $uuid;
    private string $url_read;
    private bool $deleteAttachmentAfterSend;

    public function __construct()
    {

        $this->uuid                      = Str::uuid();
        $this->url_read                  = url("/email/open/" . $this->uuid);
        $this->from                      = config('mail.from.address');
        $this->fromName                  = config('mail.from.name');
        $this->deleteAttachmentAfterSend = false;
    }

    public function getTo(): array
    {
        return $this->to;
    }

    public function getCc(): array
    {
        return $this->cc;
    }

    public function getSubject(): string
    {
        return $this->subject;
    }

    public function getBody(): string
    {
        return $this->body;
    }

    public function getFrom(): string
    {
        return $this->from;
    }

    public function getFromName(): string
    {
        return $this->fromName;
    }

    public function getAttachments(): array
    {
        return $this->attachments;
    }

    public function to(string|array $to): self
    {
        if (is_array($to)) {
            $this->to = array_merge($this->to, $to);
        } else {
            $this->to[] = $to;
        }
        return $this;
    }

    public function cc(string|array $cc): self
    {
        if (is_array($cc)) {
            $this->cc = array_merge($this->cc, $cc);
        } else {
            $this->cc[] = $cc;
        }
        return $this;
    }

    public function fromName(string $name): self
    {
        $this->fromName = $name;
        return $this;
    }

    public function subject(string $subject): self
    {
        $this->subject = $subject;
        return $this;
    }

    public function body(string $body): self
    {
        $this->body = $body;
        return $this;
    }

    public function attachment(string $path, string $name = null): self
    {
        $this->attachments[] = ['path' => $path, 'name' => $name];
        return $this;
    }

    public function deleteAttachmentAfterSend($delete = false): self
    {
        $this->deleteAttachmentAfterSend = $delete;
        return $this;
    }

    public function sendInBackground(): void
    {
        SendEmail::dispatch($this);
    }

    public function send(): void
    {
        Mail::send(new RawMailable($this));

        if ($this->deleteAttachmentAfterSend) {
            foreach ($this->attachments as $attachment) {
                @unlink($attachment['path']);
            }
        }
    }


    public function getReadURL(): string
    {
        return $this->url_read;
    }
}
