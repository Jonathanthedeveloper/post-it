class HealthController {

    async getHealth(_, res, next) {
        try {
            res.status(200).json({ status: 'success', message: 'Server is up and running' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new HealthController();