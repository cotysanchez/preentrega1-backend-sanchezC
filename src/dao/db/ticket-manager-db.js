const TicketModel = require('../models/ticket.model.js');

class TicketManager {
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        console.log('Ticket no encontrado');
        return null;
      }
      return ticket;
    } catch (error) {
      console.log('Error al traer el ticket', error);
    }
  }
}

module.exports = TicketManager;
