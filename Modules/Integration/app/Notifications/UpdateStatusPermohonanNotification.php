<?php

namespace Modules\Integration\Notifications;

use App\Models\Db1\DataIntegrasiLayanan;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class UpdateStatusPermohonanNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected DataIntegrasiLayanan $dil)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting(sprintf("Halo, %s", ucwords($this->dil->user->name)))
            ->subject(sprintf("Update Status Permohonan #%s", $this->dil->kode_order))
            ->line(new HtmlString(sprintf('Status permohonan anda untuk layanan %s dengan id<br> <b>%s</b> telah diperbarui', $this->dil->layanan->name, $this->dil->kode_order)))
            ->line(sprintf('Status sekarang: %s', strtoupper($this->dil->status_order)))
            ->action('Lihat', config('app.url') . '/app/#/dashboard');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [];
    }
}
