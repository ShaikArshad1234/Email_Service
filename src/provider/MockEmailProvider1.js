
class MockEmailProvider1 {
    async send(email) {
        const success = Math.random() > 0.5;
        if (success) {
            return { status: 'success', provider: 'Provider1' };
        } else {
            throw new Error('Provider1 failed');
        }
    }
}

export default MockEmailProvider1;
