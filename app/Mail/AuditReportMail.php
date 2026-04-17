<?php

namespace App\Mail;

use App\Models\AuditResponse;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AuditReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly AuditResponse $auditResponse) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address(env('MAIL_REPLY_TO', ''))],
            subject: 'Your Automation Readiness Report — '.$this->auditResponse->company_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.audit-report',
        );
    }
}
