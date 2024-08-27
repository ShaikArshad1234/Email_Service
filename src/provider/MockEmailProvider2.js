
class MockEmailProvider2 {
    async send(email) {

        const success = Math.random() > 0.5;
        if (success) {
            return { status: 'success', provider: 'Provider2' };
        } else {
            throw new Error('Provider2 failed');
        }
    }
}

export default MockEmailProvider2;
