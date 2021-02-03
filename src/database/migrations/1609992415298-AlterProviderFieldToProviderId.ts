import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class AlterProviderFieldToProviderId1609992415298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'provider');

    await queryRunner.addColumn(
        'appointments',
        new TableColumn({
            name: 'provider_id',
            type: 'uuid',
            isNullable: true, //estratégia
        }),
    );

    await queryRunner.createForeignKey('appointments', new TableForeignKey({
        name: 'AppointmentProvider',
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', //o que vai acontecer com o agendamento(no provider_id) caso o usuario seja deletado
        onUpdate: 'CASCADE' //caso o usuario tenha seu id alterado essa  alteração é refletida no seu relacionamentos
    }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //fazer o retorno na ordem inversa do que foi criado
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

        await queryRunner.dropColumn('appointments', 'provider_id');

        await queryRunner.addColumn('appointments',
            new TableColumn({
                name: 'provider',
                type: 'varchar',
            }),
        );
    }

}
