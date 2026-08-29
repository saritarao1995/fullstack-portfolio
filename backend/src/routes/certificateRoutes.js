const express = require('express');
const certificateController = require('../controllers/certificateController');
const { auth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/:certificateId/metadata', certificateController.getPublicMetadata);

router.use(auth);

router.get('/', certificateController.list);
router.get('/:certificateId', certificateController.getOne);
router.post('/', upload.single('document'), certificateController.create);
router.patch('/:certificateId/revoke', certificateController.revoke);

module.exports = router;
