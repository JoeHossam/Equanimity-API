const notFound = (req, res) =>
    res.status(404).json({ msg: 'path does not exist' });

module.exports = notFound;
