from faker import Faker
import os
import random
from datetime import datetime
from datetime import timedelta
from randomtimestamp import randomtimestamp
import hashlib
import random
import uuid as ud

DATA_PATH = "./data"
DATA_DB_TEST = './data/test'
CLIENTS_FILENAME = "/clients"
EXTENDING_TYPE = "csv"
CAR_FILENAME = "/cars"
ADMIN_FILENAME = "/admins"
PRODUCT_STORAGE = "/products"
CONTACTS_FILENAME = "/contracts"
MECHANIC_FILENAME = "/mechanics"
SERVICES_FILENAME = "/services"
CAN_BE_SERVED_FILENAME = "/canbeserved"
BOXES_FILENAME = "/boxes"
SHEDULE_FILENAME = "/shedule"
TIMETABLE_FILENAME = "/timetable"
APPLICATION_FILE = "/application"
VOCATION_FILE = "/vocation"

data =  ["Audi", "BMW", "Chevrolet", "Ford", "Honda", "Toyota", "Mercedes-Benz", "Volkswagen", "Volvo", "Tesla", "Nissan", "Hyundai", "Mazda", "Subaru", "Kia", "Lexus", "Ferrari", "Porsche", "Jaguar", "Land Rover"]

count = 1000
ucount = 1000
admin_count = 10
mechanic_count = 10
boxes_count = 10
application_count = 100
defaulttestpass = b"123"
h = hashlib.md5()
h.update(defaulttestpass)
hashpas = h.hexdigest()

flag = True
faker = Faker('ru_RU')
if not os.path.isdir(DATA_PATH):
    os.makedirs(DATA_PATH)
    
if not os.path.isdir(DATA_DB_TEST):
    os.makedirs(DATA_DB_TEST)
        
while flag:
    try:
        actual_all_shedule = {}
        clients_uuids = []
        admin_uuids = []
        cars_uuids = []
        products_uuids = []
        contracts_uuids = []
        services_uuids = []
        mechanic_uuids = []
        canbeserved_uuids = []
        timetable_uuids = []
        applications = []
        application_uuids = []
        boxes_uuids = []
        shedule_uuids = []
        vocations_uuids = []
        services_mechanics = {}
        mechanic_applications = []
        clients_emails = []
        admin_emails = []
        mechanic_emails = []
        mechanic_shedule = {}
        client_data_for_db_test = []



        def generate_clients():
        #     id			uuid default gen_random_uuid() primary key,
        #     email       text not null,
        #     fio         text not null,
        #     datebirth   timestamp not null,
        #     phone       text not null,
        #     password  text not null
            with open(f'{DATA_PATH}{CLIENTS_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(ucount):
                    rnd = ud.uuid4()
                    while rnd in clients_uuids:
                        rnd = ud.uuid4()
                    email = faker.ascii_email()
                    while email in clients_emails:
                        email = faker.ascii_email()
                    print(i)
                    clients_uuids.append(rnd)
                    clients_emails.append(email)
                    line = "{0};{1};{2};{3};{4};{5}\n".format(
                        rnd,
                        email,
                        faker.name(),
                        faker.date_of_birth(minimum_age=20),
                        faker.phone_number(),
                        hashpas,
                                        )
                    client_data_for_db_test.append([
                        rnd,
                        email,
                        faker.name(),
                        faker.date_of_birth(minimum_age=20),
                        faker.phone_number(),
                        hashpas
                    ])
                    file.write(line)

        def generate_cars():
            # id			uuid default gen_random_uuid() primary key,
            # nick       	text,
            # year       text not null,
            # mark	   	text not null,
            # color       text not null,
            # run  		integer not null,
            # owner		uuid not null,
            with open(f'{DATA_PATH}{CAR_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(count):
                    uuid = faker.vin()
                    while uuid in cars_uuids:
                        uuid = faker.vin()
                    cars_uuids.append(uuid)
                    line = "{0};{1};{2};{3};{4};{5};{6}\n".format(
                        uuid,
                        faker.word(),
                        faker.year(),
                        data[random.randint(0, len(data) - 1)],
                        faker.color_name(),
                        random.randint(1, 100000),
                        clients_uuids[random.randint(0, len(clients_uuids) - 1)]
                                        )
                    file.write(line)
                    
        def generate_admins():
            #     id		   uuid default gen_random_uuid() primary key,
            #     email       text not null,
            #     fio         text not null,
            #     password  text not null
            with open(f'{DATA_PATH}{ADMIN_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(admin_count):
                    uuid = faker.uuid4()
                    while uuid in admin_uuids:
                        uuid = faker.uuid4()
                    email = faker.ascii_email()
                    while email in clients_emails or email in admin_emails:
                        email = faker.ascii_email()
                    admin_uuids.append(uuid)
                    admin_emails.append(email)
                    line = "{0};{1};{2};{3}\n".format(
                        uuid,
                        email,
                        faker.name(),
                        hashpas,
                                        )
                    file.write(line)
                    
        def generate_products():
            #  id			uuid default gen_random_uuid() primary key,
            # name        text not null,
            # status		integer default 0,
            elements = ["колеса", "лампы", "аккумулятор", "диски"]
            with open(f'{DATA_PATH}{PRODUCT_STORAGE}.{EXTENDING_TYPE}', 'w') as file:
                clients_emails = []
                for i in range(len(elements)):
                    uuid = faker.uuid4()
                    while uuid in products_uuids:
                        uuid = faker.uuid4()
                    products_uuids.append(uuid)
                    line = "{0};{1}\n".format(
                        uuid,
                        elements[i]
                    )
                    file.write(line)
                    
        def generate_contract_bailments():
            # id			uuid default gen_random_uuid() primary key,
            # datestart	timestamp not null,
            # duration	timestamp not null,
            # status		integer default 0,
            # car 		uuid not null,
            # whoformed	uuid not null,
            # subject		uuid not null,
            # foreign key (status) references AutoService.ContractBailmentStatus (id),
            # foreign key (car) references AutoService.Car (id),
            # foreign key (whoformed) references AutoService.Admin (id),
            # foreign key (subject) references AutoService.ProductStorage (id)
            with open(f'{DATA_PATH}{CONTACTS_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(count):
                    uuid = faker.uuid4()
                    while uuid in contracts_uuids:
                        uuid = faker.uuid4()
                    contracts_uuids.append(uuid)
                    start_date = faker.date_between()
                    end_date = start_date
                    delta = timedelta(days=365 * (random.randint(1, 15)))
                    end_date = end_date + delta
                    if (end_date < datetime.today().date()):
                        status = 1
                    
                    line = "{0};{1};{2};{3};{4};{5}\n".format(
                        uuid,
                        start_date,
                        delta.days,
                        cars_uuids[random.randint(0, len(cars_uuids) - 1)],
                        admin_uuids[random.randint(0, len(admin_uuids) - 1)],
                        products_uuids[random.randint(0, len(products_uuids) - 1)]
                    )
                    file.write(line)
                    

        def generate_mechanic_uuids():
            # id			uuid default gen_random_uuid() primary key,
            # email       text not null,
            # fio         text not null,
            # status		uuid not null,
            # password 	text not null,
            # foreign key (status) references MechanicStatus (id)
            with open(f'{DATA_PATH}{MECHANIC_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(mechanic_count):
                    uuid = faker.uuid4()
                    while uuid in mechanic_uuids:
                        uuid = faker.uuid4()
                    mechanic_uuids.append(uuid)
                    email = faker.ascii_email()
                    while email in clients_emails or email in admin_emails or email in mechanic_emails:
                        email = faker.ascii_email()
                    mechanic_emails.append(email)
                    
                    line = "{0};{1};{2};{3}\n".format(
                        uuid,
                        email,
                        faker.name(),
                        hashpas,
                                        )
                    file.write(line)

        def generate_services():
            # id			uuid default gen_random_uuid() primary key,
            # discription text not null,
            # name        text not null,
            # price		numeric[2]
            service_name = ["Замена масла", "Диагностика двигателя", "Ремонт тормозов", "Замена шин", 
                            "Ремонт подвески", "Кузовной ремонт", "Чистка салона", "Предпродажная подготовка", 
                            "Полировка кузова", "Устранение вмятин"]
            service_discript = ["Полная или частичная замена моторного масла и масляного фильтра.",
                    "Компьютерная диагностика работы двигателя и поиск неисправностей.",
                    "Замена тормозных колодок, дисков, шлангов и другой ремонт тормозной системы.",
                    "Замена летних или зимних шин, балансировка и сход-развал.",
                    "Ремонт и замена амортизаторов, рычагов, сайлентблоков и других элементов подвески.",
                    "Восстановление геометрии кузова, покраска и устранение повреждений.",
                    "Химчистка салона с использованием профессиональных моющих средств и оборудования.",
                    "Диагностика и устранение неисправностей, мойка и полировка кузова перед продажей автомобиля.",
                    "Придание блеска и удаление мелких царапин с поверхности кузова.",
                    "Выравнивание и восстановление формы кузова после вмятин без покраски."]
            service_prices = [1500, 1000, 2500, 1200, 2000, 5000, 1800, 3000, 2200, 4000]


            with open(f'{DATA_PATH}{SERVICES_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(len(service_name)):
                    uuid = faker.uuid4()
                    while uuid in services_uuids:
                        uuid = faker.uuid4()
                    services_uuids.append(uuid)
                    email = faker.ascii_email()
                    while email in clients_emails or email in admin_emails or email in mechanic_emails:
                        email = faker.ascii_email()
                    mechanic_emails.append(email)
                    
                    line = "{0};{1};{2};{3:.2f}\n".format(
                        uuid,
                        service_discript[i],
                        service_name[i],
                        service_prices[i]
                                        )
                    file.write(line)
                    
        def generate_can_be_served():
            # id			uuid default gen_random_uuid() primary key,
            # time		timestamp not null,
            # mechanic	uuid not null,
            # service		uuid not null,
            # foreign key (service) references Service (id),
            # foreign key (mechanic) references Mechanic (id)
            with open(f'{DATA_PATH}{CAN_BE_SERVED_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(len(services_uuids)):
                    uuid = faker.uuid4()
                    while uuid in canbeserved_uuids:
                        uuid = faker.uuid4()
                    canbeserved_uuids.append(uuid)
                    
                    duration = random.randint(1, 8)
                    
                    pair = [services_uuids[i], mechanic_uuids[random.randint(0, mechanic_count - 1)]]
                    if pair[0] not in services_mechanics:
                        services_mechanics[pair[0]] = [[pair[1], duration]]
                    else:
                        services_mechanics[pair[0]].append([pair[1], duration])
                    
                    line = "{0};{1};{2};{3}\n".format(
                        uuid,
                        duration,
                        pair[1],
                        pair[0]
                        )
                    file.write(line)
                    

        def generate_boxes():
            # id			uuid default gen_random_uuid() primary key,
            # number		integer not null
            with open(f'{DATA_PATH}{BOXES_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(boxes_count):
                    uuid = faker.uuid4()
                    while uuid in boxes_uuids:
                        uuid = faker.uuid4()
                    boxes_uuids.append(uuid)
                    
                    line = "{0};{1}\n".format(
                        uuid,
                        i + 11
                                        )
                    file.write(line)
                    
                    

        def generate_shedule():
        #    id			uuid default gen_random_uuid() primary key,
        # 	starttime	timestamp not null,
        # 	endtime		timestamp not null,
        # 	mechanic	uuid not null,
        # 	box			uuid not null,
        # 	dayweek		int,
            
            actual_all_shedule = {}
            for i in range(7):
                actual_all_shedule[i + 1] = []
                    
            def check_box_in_day(box, day, start_time, end_time, mechanic):
                for rec in actual_all_shedule[day]:
                    if (rec[0] == box or rec[-1] == mechanic) and (rec[1] >= start_time and rec[1] < end_time or rec[2] > start_time and rec[2] < end_time):
                        return False
                    
                return True
            
            with open(f'{DATA_PATH}{SHEDULE_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for j in range(mechanic_count):
                    days = []
                    for i in range(5):
                        day = random.randint(1, 7)
                        while day in days:
                            day = random.randint(1, 7)
                        days.append(day)
                        ss = datetime.today()
                        ss = ss.replace(hour=8, minute=0)
                        e = datetime.today()
                        e = e.replace(hour=15, minute=0)
                        start_time = randomtimestamp(start=ss, end=e)
                        end_time = start_time
                        delta = random.randint(1, 8)
                        end_time = end_time.replace(hour=start_time.hour + delta) 
                        
                        p = 0
                        while p < len(boxes_uuids) and not check_box_in_day(boxes_uuids[p], day, start_time, end_time, mechanic_uuids[j]):
                            p += 1
                        
                        uuid = faker.uuid4()
                        while uuid in boxes_uuids:
                            uuid = faker.uuid4()
                        shedule_uuids.append(uuid)
                
                        if (p == len(boxes_uuids)):
                            continue
                        else:
                            actual_all_shedule[day].append([boxes_uuids[p], start_time, end_time, mechanic_uuids[j], uuid])
                            if mechanic_uuids[j] not in mechanic_shedule:
                                mechanic_shedule[mechanic_uuids[j]] = [[day, boxes_uuids[p], start_time, end_time, uuid]]
                            else:
                                mechanic_shedule[mechanic_uuids[j]].append([day, boxes_uuids[p], start_time, end_time, uuid])
                            line = "{0};{1};{2};{3};{4};{5}\n".format(
                            uuid,
                            start_time,
                            end_time,
                            mechanic_uuids[j],
                            boxes_uuids[p],
                            day
                                )
                            file.write(line)
                            

        def generate_application():
            # id			uuid default gen_random_uuid() primary key,
            # timerecord	uuid,
            # comment 	text, 
            # service		uuid not null,
            # status 		integer default 0 not null,
            # car 		text not null,   
            with open(f'{DATA_PATH}{APPLICATION_FILE}.{EXTENDING_TYPE}', 'w') as file:
                for _ in range(application_count):
                    uuid = faker.uuid4()
                    while uuid in application_uuids:
                        uuid = faker.uuid4()
                    application_uuids.append(uuid)
                    applications.append([uuid, None, None, services_uuids[random.randint(0, len(services_uuids) - 1)], 0, cars_uuids[random.randint(0, len(cars_uuids) - 1)]])
                    
                generate_timetable()
                generate_vocations()
            
                for i in range(application_count):
                    line = "{0};{1};{2};{3};{4}\n".format(
                            applications[i][0],
                            timetable_uuids[i],
                            applications[i][3],
                            applications[i][4],
                            applications[i][5]
                    )
                    file.write(line)
                
                
        def generate_timetable():
            # id			uuid default gen_random_uuid() primary key,
            # datetime	timestamp not null,
            # shedule 	uuid,
            # foreign key (service) references AutoService.CanBeServed (id),
            # foreign key (shedule) references AutoService.Shedule (id)
            
            actual_timetable = {}
            
            with open(f'{DATA_PATH}{TIMETABLE_FILENAME}.{EXTENDING_TYPE}', 'w') as file:
                for i in range(application_count):
                    vars_mechanics = services_mechanics[applications[i][3]]
                    mechanic = None
                    dayweek = None
                    shedule = None
                    for m in vars_mechanics:
                        his_shedule = mechanic_shedule[m[0]]
                        for rec in his_shedule:
                            if (rec[3] - rec[2]).total_seconds() / 3600 >= m[1]:
                                mechanic = m[0]
                                dayweek = rec[0]
                                shedule = rec[-1]
                                break
                        if mechanic and dayweek and shedule:
                            break
                    
                    s = datetime.today()
                    s = s.replace(day=s.day + 1)
                    e = datetime.today()
                    e = e.replace(year = s.year + 10)
                        
                    if mechanic and dayweek and shedule:
                        date = randomtimestamp(start=s, end=e)
                        delta = dayweek - date.weekday();
                        date += timedelta(days=delta)
                        while date in actual_timetable and applications[i][-1] not in actual_timetable[date][0]:
                            date = randomtimestamp(start=s, end=e)
                            delta = dayweek - date.weekday();
                            date += timedelta(days=delta)
                        applications[i][-2] = 1
                        if date not in actual_timetable:
                            actual_timetable[date] = [[applications[i][-1], applications[i]]]
                        else:
                            actual_timetable[date].append([applications[i][-1], applications[i]])
                        uuid = faker.uuid4()
                        mechanic_applications.append(mechanic)
                        while uuid in timetable_uuids:
                            uuid = faker.uuid4()
                        timetable_uuids.append(uuid)
                        line = "{0};{1};{2}\n".format(
                        uuid,
                        date,
                        shedule)
                        file.write(line)
                    
        def generate_vocations():
            # id			uuid default gen_random_uuid() primary key,
            # start_date	timestamp not null,
            # end_date	timestamp not null check (date_trunc('day', start_date) < date_trunc('day', end_date) and 
            # 									  (date_trunc('day', current_date) < date_trunc('day', start_date) or 
            # 									  date_trunc('day', current_date) > date_trunc('day', end_date)
            # 									  )),
            with open(f'{DATA_PATH}{VOCATION_FILE}.{EXTENDING_TYPE}', 'w') as file:
                s = datetime.today()
                s += timedelta(days=1)
                e = s.replace(year = s.year + 10)
                for mechanic in mechanic_uuids:
                    date_start = randomtimestamp(start=s, end=e)
                    date_end = date_start + timedelta(days=15)
                    uuid = faker.uuid4()
                    while uuid in vocations_uuids:
                        uuid = faker.uuid4()
                    vocations_uuids.append(uuid)
                    line = "{0};{1};{2};{3}\n".format(
                        uuid,
                        date_start,
                        date_end,
                        mechanic)
                    file.write(line)
                    
        def generate_db_test():
            for i in range(0, ucount, 25000):
                with open(f'{DATA_DB_TEST}/{i}.{EXTENDING_TYPE}', 'w') as file:
                    for j in range(0, i):
                        line = "{0};{1};{2};{3};{4};{5}\n".format(
                        client_data_for_db_test[j][0],
                        client_data_for_db_test[j][1],
                        client_data_for_db_test[j][2],
                        client_data_for_db_test[j][3],
                        client_data_for_db_test[j][4],
                        client_data_for_db_test[j][5],
                                        )
                        file.write(line)

        generate_clients()
        generate_cars()
        generate_admins()
        generate_products()
        generate_contract_bailments()
        generate_mechanic_uuids()
        generate_services()
        generate_can_be_served()
        generate_boxes()
        generate_shedule()
        generate_application()
        generate_db_test()
        flag = False
    except Exception as e:
        print(e)
        pass