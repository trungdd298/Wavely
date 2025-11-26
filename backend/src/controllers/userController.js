export const authProfile = async (req, res) => {
    try {
        const user = req.user; // req.user is set in authMiddleware

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error when fetching user profile: ', error);
        return res.status(500).json({ message: 'System error' });
    }
};
