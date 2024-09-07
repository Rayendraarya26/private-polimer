<?php

namespace App\Mail;

use App\Libraries\Mailer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RawMailable extends Mailable
{
    use Queueable, SerializesModels;

    public Mailer $email;

    /**
     * Create a new message instance.
     */
    public function __construct(Mailer $email)
    {
        $this->email = $email;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $listTo = [];
        foreach ($this->email->getTo() as $to) {
            $listTo[] = new Address($to);
        }
        $listCc = [];
        foreach ($this->email->getCc() as $cc) {
            $listCc[] = new Address($cc);
        }
        return new Envelope(
            from: new Address($this->email->getFrom(), $this->email->getFromName()),
            to: $listTo,
            cc: $listCc,
            subject: $this->email->getSubject(),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.raw',
            with: [
                'url_read' => $this->email->getReadURL(),
                'content'  => $this->email->getBody(),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $attachment = [];
        foreach ($this->email->getAttachments() as $file) {
            $attachment[] = Attachment::fromPath($file['path'])->as($file['name']);
        }

        return $attachment;
    }
}
