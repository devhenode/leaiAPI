export const log_middleware = async (req, res, next) => {
    console.log(req.method, req.url)
    next();
}