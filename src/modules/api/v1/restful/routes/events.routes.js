import { Router } from 'express';
import EventsController from '../controllers/events.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createEventSchema,
  createGuildEventSchema,
  createScheduledEventSchema,
  updateEventSchema,
  updateEventNameSchema,
  updateEventChannelSchema,
  updateEventPrizesSchema,
  updateEventDurationSchema,
  updateEventTimeSchema,
  updateEventDaysSchema,
  updateEventCitySchema,
  getEventByIdSchema,
  getEventsByGuildIdSchema,
  getEventsByChannelSchema,
  getEventsByNameSchema,
  getEventsByCitySchema,
  getEventsByDurationSchema,
  getEventsByTimeSchema,
  getEventsByDaysSchema,
  getEventsByDateRangeSchema,
  getRecentEventsSchema,
  searchEventsSchema,
  deleteEventSchema,
  deleteGuildEventsSchema,
  deleteChannelEventsSchema,
  deleteOldEventsSchema,
  deleteEventsByCitySchema
} from '../validators/events.validator.js';

const router = Router();

// إنشاء الأحداث
router.post('/', validationMiddlewareFactory(createEventSchema, 'body'), EventsController.createEvent);
router.post('/guild/:guildId', validationMiddlewareFactory(createGuildEventSchema, 'body'), EventsController.createGuildEvent);
router.post('/scheduled', validationMiddlewareFactory(createScheduledEventSchema, 'body'), EventsController.createScheduledEvent);

// الحصول على الأحداث
router.get('/', EventsController.getAllEvents);
router.get('/recent', validationMiddlewareFactory(getRecentEventsSchema, 'query'), EventsController.getRecentEvents);
router.get('/search', validationMiddlewareFactory(searchEventsSchema, 'query'), EventsController.searchEvents);
router.get('/with-prizes', EventsController.getEventsWithPrizes);
router.get('/without-prizes', EventsController.getEventsWithoutPrizes);
router.get('/stats', EventsController.getEventStats);
router.get('/count', EventsController.countAllEvents);
router.get('/count/with-prizes', EventsController.countEventsWithPrizes);
router.get('/date-range', validationMiddlewareFactory(getEventsByDateRangeSchema, 'query'), EventsController.getEventsByDateRange);
router.get('/time', validationMiddlewareFactory(getEventsByTimeSchema, 'params'), EventsController.getEventsByTime);
router.get('/guild/:guildId', validationMiddlewareFactory(getEventsByGuildIdSchema, 'params'), EventsController.getEventsByGuildId);
router.get('/channel/:channelId', validationMiddlewareFactory(getEventsByChannelSchema, 'params'), EventsController.getEventsByChannel);
router.get('/name/:eventName', validationMiddlewareFactory(getEventsByNameSchema, 'params'), EventsController.getEventsByName);
router.get('/city/:city', validationMiddlewareFactory(getEventsByCitySchema, 'params'), EventsController.getEventsByCity);
router.get('/duration/:duration', validationMiddlewareFactory(getEventsByDurationSchema, 'params'), EventsController.getEventsByDuration);
router.get('/days/:days', validationMiddlewareFactory(getEventsByDaysSchema, 'params'), EventsController.getEventsByDays);
router.get('/:eventId', validationMiddlewareFactory(getEventByIdSchema, 'params'), EventsController.getEventById);
router.get('/:eventId/exists', validationMiddlewareFactory(getEventByIdSchema, 'params'), EventsController.checkEventExists);

// تحديث الأحداث
router.put('/:eventId', validationMiddlewareFactory(updateEventSchema, 'body'), EventsController.updateEvent);
router.patch('/:eventId/name', validationMiddlewareFactory(updateEventNameSchema, 'body'), EventsController.updateEventName);
router.patch('/:eventId/channel', validationMiddlewareFactory(updateEventChannelSchema, 'body'), EventsController.updateEventChannel);
router.patch('/:eventId/prizes', validationMiddlewareFactory(updateEventPrizesSchema, 'body'), EventsController.updateEventPrizes);
router.patch('/:eventId/duration', validationMiddlewareFactory(updateEventDurationSchema, 'body'), EventsController.updateEventDuration);
router.patch('/:eventId/time', validationMiddlewareFactory(updateEventTimeSchema, 'body'), EventsController.updateEventTime);
router.patch('/:eventId/days', validationMiddlewareFactory(updateEventDaysSchema, 'body'), EventsController.updateEventDays);
router.patch('/:eventId/city', validationMiddlewareFactory(updateEventCitySchema, 'body'), EventsController.updateEventCity);

// حذف الأحداث
router.delete('/:eventId', validationMiddlewareFactory(deleteEventSchema, 'params'), EventsController.deleteEvent);
router.delete('/guild/:guildId', validationMiddlewareFactory(deleteGuildEventsSchema, 'params'), EventsController.deleteGuildEvents);
router.delete('/channel/:channelId', validationMiddlewareFactory(deleteChannelEventsSchema, 'params'), EventsController.deleteChannelEvents);
router.delete('/city/:city', validationMiddlewareFactory(deleteEventsByCitySchema, 'params'), EventsController.deleteEventsByCity);
router.delete('/old/cleanup', validationMiddlewareFactory(deleteOldEventsSchema, 'query'), EventsController.deleteOldEvents);
router.delete('/without-prizes/cleanup', EventsController.deleteEventsWithoutPrizes);

export default router;