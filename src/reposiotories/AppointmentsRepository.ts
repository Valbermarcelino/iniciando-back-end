import Appointment from '../models/Appointments';

import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
    public async findByDate(date: Date): Promise<Appointment | null> { //async sempre vai retornar uma promise; sempre q uso await tem q ter o async
        /*const findAppointment = this.appointments.find(appointment =>
            isEqual(date, appointment.date)
        );*/
        const findAppointment = await this.findOne({
            where: { date },
        });

        return findAppointment || null;
    }
}

export default AppointmentsRepository;
