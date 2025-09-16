import { EventsService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

class EventsController {
  /**
   * إنشاء حدث جديد
   */
  static async createEvent(req, res) {
    try {
      const result = await EventsService.createEvent(req.body);
      send(res, { data: result }, 'تم إنشاء الحدث بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء الحدث', 500);
    }
  }

  /**
   * إنشاء حدث للخادم
   */
  static async createGuildEvent(req, res) {
    try {
      const { guildId } = req.params;
      const result = await EventsService.createGuildEvent(guildId, req.body);
      send(res, { data: result }, 'تم إنشاء حدث الخادم بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء حدث الخادم', 500);
    }
  }

  /**
   * إنشاء حدث مجدول
   */
  static async createScheduledEvent(req, res) {
    try {
      const { guildId, eventName, eventChannel, duration, hour, minute, apm, days } = req.body;
      const result = await EventsService.createScheduledEvent(
        guildId, eventName, eventChannel, duration, hour, minute, apm, days, req.body
      );
      send(res, { data: result }, 'تم إنشاء الحدث المجدول بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء الحدث المجدول', 500);
    }
  }

  /**
   * الحصول على جميع الأحداث
   */
  static async getAllEvents(req, res) {
    try {
      const result = await EventsService.getAllEvents(req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث', 500);
    }
  }

  /**
   * الحصول على حدث بواسطة معرف الحدث
   */
  static async getEventById(req, res) {
    try {
      const { eventId } = req.params;
      const result = await EventsService.getEventById(eventId);
      if (result) {
        send(res, { data: result }, 'تم الحصول على الحدث بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على الحدث', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الحدث', 500);
    }
  }

  /**
   * الحصول على أحداث الخادم
   */
  static async getEventsByGuildId(req, res) {
    try {
      const { guildId } = req.params;
      const result = await EventsService.getEventsByGuildId(guildId, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على أحداث الخادم بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث للخادم', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على أحداث الخادم', 500);
    }
  }

  /**
   * الحصول على الأحداث بواسطة القناة
   */
  static async getEventsByChannel(req, res) {
    try {
      const { channelId } = req.params;
      const result = await EventsService.getEventsByChannel(channelId, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على أحداث القناة بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث للقناة', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على أحداث القناة', 500);
    }
  }

  /**
   * الحصول على الأحداث بواسطة الاسم
   */
  static async getEventsByName(req, res) {
    try {
      const { eventName } = req.params;
      const result = await EventsService.getEventsByName(eventName, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث بالاسم بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث بهذا الاسم', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث بالاسم', 500);
    }
  }

  /**
   * الحصول على الأحداث بواسطة المدينة
   */
  static async getEventsByCity(req, res) {
    try {
      const { city } = req.params;
      const result = await EventsService.getEventsByCity(city, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على أحداث المدينة بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث في هذه المدينة', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على أحداث المدينة', 500);
    }
  }

  /**
   * الحصول على الأحداث بواسطة المدة
   */
  static async getEventsByDuration(req, res) {
    try {
      const { duration } = req.params;
      const result = await EventsService.getEventsByDuration(duration, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث بالمدة بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث بهذه المدة', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث بالمدة', 500);
    }
  }

  /**
   * الحصول على الأحداث بواسطة الوقت
   */
  static async getEventsByTime(req, res) {
    try {
      const { hour, minute, apm } = req.query;
      const result = await EventsService.getEventsByTime(hour, minute, apm, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث بالوقت بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث في هذا الوقت', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث بالوقت', 500);
    }
  }

  /**
   * الحصول على الأحداث بواسطة الأيام
   */
  static async getEventsByDays(req, res) {
    try {
      const { days } = req.params;
      const result = await EventsService.getEventsByDays(days, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث بالأيام بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث في هذه الأيام', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث بالأيام', 500);
    }
  }

  /**
   * الحصول على الأحداث بواسطة نطاق زمني
   */
  static async getEventsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await EventsService.getEventsByDateRange(new Date(startDate), new Date(endDate), req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث بالنطاق الزمني بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث في هذا النطاق الزمني', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث بالنطاق الزمني', 500);
    }
  }

  /**
   * الحصول على الأحداث الحديثة
   */
  static async getRecentEvents(req, res) {
    try {
      const { limit } = req.query;
      const result = await EventsService.getRecentEvents(limit ? parseInt(limit) : 50, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث الحديثة بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث حديثة', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث الحديثة', 500);
    }
  }

  /**
   * البحث في الأحداث
   */
  static async searchEvents(req, res) {
    try {
      const { searchTerm } = req.query;
      const result = await EventsService.searchEvents(searchTerm, req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم البحث في الأحداث بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على نتائج للبحث', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث في الأحداث', 500);
    }
  }

  /**
   * الحصول على الأحداث التي تحتوي على جوائز
   */
  static async getEventsWithPrizes(req, res) {
    try {
      const result = await EventsService.getEventsWithPrizes(req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث مع الجوائز بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث مع جوائز', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث مع الجوائز', 500);
    }
  }

  /**
   * الحصول على الأحداث بدون جوائز
   */
  static async getEventsWithoutPrizes(req, res) {
    try {
      const result = await EventsService.getEventsWithoutPrizes(req.query);
      if (result && result.length > 0) {
        send(res, { data: result }, 'تم الحصول على الأحداث بدون جوائز بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على أحداث بدون جوائز', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الأحداث بدون جوائز', 500);
    }
  }

  /**
   * تحديث حدث
   */
  static async updateEvent(req, res) {
    try {
      const { eventId } = req.params;
      const result = await EventsService.updateEvent(eventId, req.body);
      send(res, { data: result }, 'تم تحديث الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الحدث', 500);
    }
  }

  /**
   * تحديث اسم الحدث
   */
  static async updateEventName(req, res) {
    try {
      const { eventId } = req.params;
      const { eventName } = req.body;
      const result = await EventsService.updateEventName(eventId, eventName);
      send(res, { data: result }, 'تم تحديث اسم الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث اسم الحدث', 500);
    }
  }

  /**
   * تحديث قناة الحدث
   */
  static async updateEventChannel(req, res) {
    try {
      const { eventId } = req.params;
      const { channelId } = req.body;
      const result = await EventsService.updateEventChannel(eventId, channelId);
      send(res, { data: result }, 'تم تحديث قناة الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث قناة الحدث', 500);
    }
  }

  /**
   * تحديث جوائز الحدث
   */
  static async updateEventPrizes(req, res) {
    try {
      const { eventId } = req.params;
      const { prizes } = req.body;
      const result = await EventsService.updateEventPrizes(eventId, prizes);
      send(res, { data: result }, 'تم تحديث جوائز الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث جوائز الحدث', 500);
    }
  }

  /**
   * تحديث مدة الحدث
   */
  static async updateEventDuration(req, res) {
    try {
      const { eventId } = req.params;
      const { duration } = req.body;
      const result = await EventsService.updateEventDuration(eventId, duration);
      send(res, { data: result }, 'تم تحديث مدة الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث مدة الحدث', 500);
    }
  }

  /**
   * تحديث وقت الحدث
   */
  static async updateEventTime(req, res) {
    try {
      const { eventId } = req.params;
      const { hour, minute, apm } = req.body;
      const result = await EventsService.updateEventTime(eventId, hour, minute, apm);
      send(res, { data: result }, 'تم تحديث وقت الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث وقت الحدث', 500);
    }
  }

  /**
   * تحديث أيام الحدث
   */
  static async updateEventDays(req, res) {
    try {
      const { eventId } = req.params;
      const { days } = req.body;
      const result = await EventsService.updateEventDays(eventId, days);
      send(res, { data: result }, 'تم تحديث أيام الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث أيام الحدث', 500);
    }
  }

  /**
   * تحديث مدينة الحدث
   */
  static async updateEventCity(req, res) {
    try {
      const { eventId } = req.params;
      const { city } = req.body;
      const result = await EventsService.updateEventCity(eventId, city);
      send(res, { data: result }, 'تم تحديث مدينة الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث مدينة الحدث', 500);
    }
  }

  /**
   * حذف حدث
   */
  static async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      const result = await EventsService.deleteEvent(eventId);
      if (result) {
        send(res, { data: result }, 'تم حذف الحدث بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على الحدث للحذف', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الحدث', 500);
    }
  }

  /**
   * حذف أحداث الخادم
   */
  static async deleteGuildEvents(req, res) {
    try {
      const { guildId } = req.params;
      const result = await EventsService.deleteGuildEvents(guildId);
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} حدث للخادم بنجاح`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف أحداث الخادم', 500);
    }
  }

  /**
   * حذف أحداث القناة
   */
  static async deleteChannelEvents(req, res) {
    try {
      const { channelId } = req.params;
      const result = await EventsService.deleteChannelEvents(channelId);
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} حدث للقناة بنجاح`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف أحداث القناة', 500);
    }
  }

  /**
   * حذف الأحداث القديمة
   */
  static async deleteOldEvents(req, res) {
    try {
      const { daysOld } = req.query;
      const result = await EventsService.deleteOldEvents(daysOld ? parseInt(daysOld) : 30);
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} حدث قديم بنجاح`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الأحداث القديمة', 500);
    }
  }

  /**
   * حذف الأحداث بدون جوائز
   */
  static async deleteEventsWithoutPrizes(req, res) {
    try {
      const result = await EventsService.deleteEventsWithoutPrizes();
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} حدث بدون جوائز بنجاح`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الأحداث بدون جوائز', 500);
    }
  }

  /**
   * حذف الأحداث بواسطة المدينة
   */
  static async deleteEventsByCity(req, res) {
    try {
      const { city } = req.params;
      const result = await EventsService.deleteEventsByCity(city);
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} حدث في المدينة بنجاح`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف أحداث المدينة', 500);
    }
  }

  /**
   * الحصول على إحصائيات الأحداث
   */
  static async getEventStats(req, res) {
    try {
      const result = await EventsService.getEventStats();
      send(res, { data: result }, 'تم الحصول على إحصائيات الأحداث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على إحصائيات الأحداث', 500);
    }
  }

  /**
   * عد جميع الأحداث
   */
  static async countAllEvents(req, res) {
    try {
      const result = await EventsService.countAllEvents();
      send(res, { data: { count: result } }, 'تم عد الأحداث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد الأحداث', 500);
    }
  }

  /**
   * عد الأحداث مع الجوائز
   */
  static async countEventsWithPrizes(req, res) {
    try {
      const result = await EventsService.countEventsWithPrizes();
      send(res, { data: { count: result } }, 'تم عد الأحداث مع الجوائز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد الأحداث مع الجوائز', 500);
    }
  }

  /**
   * التحقق من وجود حدث
   */
  static async checkEventExists(req, res) {
    try {
      const { eventId } = req.params;
      const result = await EventsService.getEventById(eventId);
      const exists = result !== null;
      send(res, { data: { exists, event: result } }, exists ? 'الحدث موجود' : 'الحدث غير موجود', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من وجود الحدث', 500);
    }
  }
}

export default EventsController;