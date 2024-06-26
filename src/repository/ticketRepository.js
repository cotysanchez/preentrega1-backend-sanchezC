const TicketModel = require('../dao/models/ticket.model.js');

class TicketRepository {
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        req.logger.info('Ticket no encontrado');
        return null;
      }
      return ticket;
    } catch (error) {
      req.logger.info('Error al obtener el ticket', error);
      throw error;
    }
  }
}
module.exports = TicketRepository;
