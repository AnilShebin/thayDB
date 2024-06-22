const express = require('express');
const router = express.Router();
const service = require('../services/holidayService');

router.get('/', async (req, res, next) => {
  try {
    const holidays = await service.getAllHolidays();
    res.send(holidays);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const holiday = await service.getHolidayByID(req.params.id);
    if (!holiday) {
      res.status(404).json('No record with the given ID: ' + req.params.id);
    } else {
      res.send(holiday);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const affectedRows = await service.deleteHoliday(req.params.id);
    if (affectedRows === 0)
      res.status(404).json('No record with the given ID: ' + req.params.id);
    else
      res.send('Delete successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.post('/', async (req, res, next) => {
  try {
    await service.createHoliday(req.body);
    res.status(201).send('Create successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const affectedRows = await service.updateHoliday(req.body, req.params.id);
    if (affectedRows === 0)
      res.status(404).json('No record with the given ID: ' + req.params.id);
    else
      res.send('Updated successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

module.exports = router;