import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO} from 'date-fns'

import AppointmentsRepository from '../reposiotories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated); //aplicando middleware em todas as rotas

appointmentsRouter.get('/', async (request, response) => {
    console.log(request.user);

    const appointmentsRepository = getCustomRepository(AppointmentsRepository); //os métodos q vão trabalhar com o banco de dados geralmente precisam de um await
    const appointments = await appointmentsRepository.find(); //busca tudo

    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({ date: parsedDate, provider_id });

        return response.json(appointment);
});

export default appointmentsRouter;
