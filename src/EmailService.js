
class EmailService {
    constructor(providers) {
        this.providers = providers;
        this.maxRetries = 3;
        this.retryDelay = 1000; 
        this.status = [];
        this.sentEmails = new Set();
        this.rateLimit = 5; 
        this.rateLimitInterval = 60000; 
        this.sentEmailsCount = 0;
        this.resetRateLimit();
    }

    resetRateLimit() {
        setInterval(() => {
            this.sentEmailsCount = 0;
        }, this.rateLimitInterval);
    }

    async sendEmail(email) {
        if (this.sentEmails.has(email.id)) {
            this.status.push({ timestamp: new Date(), status: 'Duplicate email detected, not sending.' });
            return;
        }

        if (this.sentEmailsCount >= this.rateLimit) {
            this.status.push({ timestamp: new Date(), status: 'Rate limit exceeded, try again later.' });
            return;
        }

        let attempt = 0;
        for (let provider of this.providers) {
            while (attempt < this.maxRetries) {
                try {
                    const result = await provider.send(email);
                    this.status.push({ timestamp: new Date(), status: `Email sent successfully via ${result.provider}` });
                    this.sentEmails.add(email.id);
                    this.sentEmailsCount += 1;
                    return;
                } catch (error) {
                    attempt++;
                    this.status.push({ timestamp: new Date(), status: `Attempt ${attempt} failed with error: ${error.message}` });
                    await this.sleep(this.retryDelay * Math.pow(2, attempt));
                }
            }
            attempt = 0; 
        }

        this.status.push({ timestamp: new Date(), status: 'All providers failed to send email.' });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getStatus() {
        return this.status;
    }
}

export default EmailService;
