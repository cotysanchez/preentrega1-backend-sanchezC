const TicketModel = require('../models/ticket.model.js');

class TicketManager {
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        req.logger.info('Ticket no encontrado');
        return null;
      }
      return ticket;
    } catch (error) {
      req.logger.info('Error al traer el ticket', error);
    }
  }
}

module.exports = TicketManager;
