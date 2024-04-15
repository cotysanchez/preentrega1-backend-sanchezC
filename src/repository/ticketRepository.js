const TicketModel =require("../dao/models/ticket.model.js")

class TicketRepository {
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        console.log('Ticket no encontrado');
        return null;
      }
      return ticket;
    } catch (error) {
      console.log('Error al obtener el ticket', error);
      throw error;
    }
  }
}
module.exports = TicketRepository;