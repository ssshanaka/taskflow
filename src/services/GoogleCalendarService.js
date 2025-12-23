/**
 * GoogleCalendarService - Service for interacting with Google Calendar API
 * Used to create calendar events for tasks with specific times
 */

class GoogleCalendarService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://www.googleapis.com/calendar/v3';
    this.taskFlowCalendarName = 'TaskFlow Tasks';
    this.taskFlowCalendarId = null; // Will be set after initialization
  }

  /**
   * Initialize the service by getting/creating the TaskFlow calendar
   */
  async initialize() {
    this.taskFlowCalendarId = await this.getOrCreateTaskFlowCalendar();
    return this.taskFlowCalendarId;
  }

  /**
   * Get or create the dedicated TaskFlow calendar
   */
  async getOrCreateTaskFlowCalendar() {
    try {
      // First, try to find existing TaskFlow calendar
      const response = await fetch(`${this.baseUrl}/users/me/calendarList`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calendar list');
      }

      const data = await response.json();
      const existingCalendar = data.items?.find(
        cal => cal.summary === this.taskFlowCalendarName
      );

      if (existingCalendar) {
        // console.log('Found existing TaskFlow calendar:', existingCalendar.id);
        return existingCalendar.id;
      }

      // Create new calendar if not found
      return await this.createTaskFlowCalendar();
    } catch (error) {
      console.error('Error getting/creating TaskFlow calendar:', error);
      throw error;
    }
  }

  /**
   * Create the TaskFlow calendar
   */
  async createTaskFlowCalendar() {
    try {
      const response = await fetch(`${this.baseUrl}/calendars`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: this.taskFlowCalendarName,
          description: 'Calendar for TaskFlow tasks with specific times',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create TaskFlow calendar');
      }

      const calendar = await response.json();
      console.log('Created TaskFlow calendar:', calendar.id);
      return calendar.id;
    } catch (error) {
      console.error('Error creating TaskFlow calendar:', error);
      throw error;
    }
  }

  /**
   * Create a calendar event for a task
   * @param {Object} task - Task object with title, notes, etc.
   * @param {string} startTime - Start time in ISO 8601 format
   * @param {string} endTime - End time in ISO 8601 format
   * @returns {Promise<string>} - Event ID
   */
  async createEvent(task, startTime, endTime) {
    if (!this.taskFlowCalendarId) {
      await this.initialize();
    }

    try {
      const event = {
        summary: task.title || 'Untitled Task',
        description: task.notes || '',
        start: {
          dateTime: startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        // Link back to task
        extendedProperties: {
          private: {
            taskId: task.id || '',
            isTaskFlowEvent: 'true'
          }
        }
      };

      const response = await fetch(
        `${this.baseUrl}/calendars/${this.taskFlowCalendarId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create calendar event');
      }

      const createdEvent = await response.json();
      // console.log('Created calendar event:', createdEvent.id);
      return createdEvent.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   * @param {string} eventId - Event ID
   * @param {Object} updates - Updates to apply (title, startTime, endTime, notes)
   */
  async updateEvent(eventId, updates) {
    if (!this.taskFlowCalendarId) {
      await this.initialize();
    }

    try {
      // First get the existing event
      const getResponse = await fetch(
        `${this.baseUrl}/calendars/${this.taskFlowCalendarId}/events/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!getResponse.ok) {
        throw new Error('Failed to fetch event for update');
      }

      const existingEvent = await getResponse.json();

      // Build updated event
      const updatedEvent = {
        ...existingEvent,
        summary: updates.title || existingEvent.summary,
        description: updates.notes !== undefined ? updates.notes : existingEvent.description
      };

      if (updates.startTime) {
        updatedEvent.start = {
          dateTime: updates.startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }

      if (updates.endTime) {
        updatedEvent.end = {
          dateTime: updates.endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }

      // Update the event
      const updateResponse = await fetch(
        `${this.baseUrl}/calendars/${this.taskFlowCalendarId}/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedEvent)
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update calendar event');
      }

      const updated = await updateResponse.json();
      console.log('Updated calendar event:', updated.id);
      return updated;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   * @param {string} eventId - Event ID
   */
  async deleteEvent(eventId) {
    if (!this.taskFlowCalendarId) {
      await this.initialize();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/calendars/${this.taskFlowCalendarId}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to delete calendar event');
      }

      console.log('Deleted calendar event:', eventId);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * Get event details
   * @param {string} eventId - Event ID
   */
  async getEvent(eventId) {
    if (!this.taskFlowCalendarId) {
      await this.initialize();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/calendars/${this.taskFlowCalendarId}/events/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching calendar event:', error);
      throw error;
    }
  }
}

export default GoogleCalendarService;
