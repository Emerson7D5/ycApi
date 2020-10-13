--                                                  STORED PROCEDURES - yocompro


--                                                  7 de Octubre, 2020

-- Procedimiento almacenado para traer los datos del header por tienda, nuevos y en proceso.
-- Stored procedure to fetch the header data by store, new and in process.

delimiter //
create procedure new_order_header_by_store(in idStore int)
begin
	select od.id as _id, od.unique_order_id as order_code, od.created_at as order_creation_date, od.created_at as order_aceptation_date,
		od.updated_at as order_done_date,
		(select ad.created_at from accept_deliveries ad where ad.order_id = od.id) as order_checkout_date,
		(select ad.updated_at from accept_deliveries ad where ad.order_id = od.id) as order_delivery_date,
		(select name from orderstatuses ost where ost.id = od.orderstatus_id) as order_status_name,
		od.user_id as order_customer_id, (select us.name from users us where us.id = od.user_id) as user_fullname
	from orders od
	where (od.restaurant_id = idStore and od.orderstatus_id < 3);
end
//

delimiter ;


-- Procedimiento almacenado para traer los datos del header por tienda, finalizados, por entregar, o entregados.
-- Stored procedure to fetch the header data by store, completed, to be delivered, or delivered.
delimiter //
create procedure order_header_by_store_record(in idStore int)
begin
	select od.id as _id, od.unique_order_id as order_code, od.created_at as order_creation_date, od.created_at as order_aceptation_date,
		od.updated_at as order_done_date,
		(select ad.created_at from accept_deliveries ad where ad.order_id = od.id) as order_checkout_date,
		(select ad.updated_at from accept_deliveries ad where ad.order_id = od.id) as order_delivery_date,
		(select name from orderstatuses ost where ost.id = od.orderstatus_id) as order_status_name,
		od.user_id as order_customer_id, (select us.name from users us where us.id = od.user_id) as user_fullname
	from orders od
	where od.restaurant_id = idStore and (od.orderstatus_id > 2 and od.orderstatus_id < 6)
	order by od.id desc
	limit 25;
end
//

delimiter ;


-- THIS STORED PROCEDURE IS TO CHANGE THE STATUS OF THE ORDER FROM "ORDER PLACED" TO "ORDER ACCEPTED"
delimiter //
create procedure change_header_status_to_accepted(in idOrder int)
begin
	declare previous_state int;
	select orderstatus_id into previous_state from orders where id = idOrder;

	if previous_state = 1 then
		begin
			update orders set orderstatus_id = 2, created_at = (select now()) where id = idOrder;
		end;
	end if;
end
//
delimiter ;


-- THIS STORED PROCEDURE IS TO CHANGE THE STATUS OF THE ORDER FROM "ORDER ACCEPTED" TO "DELIVERY ASSIGNED"
delimiter //
create procedure change_header_status_to_delivery_assigned(in idOrder int)
begin
	declare previous_state int;
	select orderstatus_id into previous_state from orders where id = idOrder;

	if previous_state = 2 then
		begin
			update orders set orderstatus_id = 3, updated_at = (select now()) where id = idOrder;
		end;
	end if;
end
//
delimiter ;



-- THIS STORED PROCEDURE IS TO CHANGE THE STATUS OF THE ORDER FROM "DELIVERY ASSIGNED" TO "PICKED UP"
delimiter //
create procedure change_header_status_to_picked_up(in idOrder int, in userId int, in customerId int)
begin
	declare previous_state int;
	select orderstatus_id into previous_state from orders where id = idOrder;

	if previous_state = 3 then
		begin
			insert into accept_deliveries (order_id, user_id, customer_id, is_complete, created_at, updated_at)
			values
			(idOrder, userId, customerId, 0, (select now()), null);

			update orders set orderstatus_id = 4 where id = idOrder;
		end;
	end if;
end
//
delimiter ;




-- THIS STORED PROCEDURE IS TO CHANGE THE STATUS OF THE ORDER FROM "PICKED UP" TO "COMPLETED"
delimiter //
create procedure change_header_status_to_completed(in idOrder int)
begin
	declare previous_state int;
	select orderstatus_id into previous_state from orders where id = idOrder;

	if previous_state = 4 then
		begin
			update accept_deliveries set is_complete = 1, updated_at = (select now()) where order_id = idOrder;

			update orders set orderstatus_id = 5 where id = idOrder;
		end;
	end if;
end
//
delimiter ;


-- 					Octubre 8th, 2020

-- THIS STORED PROCEDURE FETCH THE SETTINGS DATA...
delimiter //
create procedure fetchDataSettings()
begin
	select id, s.key, value from settings s
	where (s.key = 'storeColor' or s.key = 'loginLoginTitle' or s.key = 'loginLoginEmailLabel' or s.key = 'loginLoginPasswordLabel'
		or s.key = 'emailPassDonotMatch');
end
//
delimiter ;


--                               Octubre 9, 2020

-- THIS STORED PROCEDURE FETCH THE RESTAURANT INFORMATION
delimiter //
create procedure fetching_information_store(in idStore int)
begin
	select r.name as store_name, r.image as store_img, r.description as store_description,
		(select count(*) from orders o where o.restaurant_id = idStore) as ordenes,
		(select count(*) from items i where (restaurant_id = idStore and i.is_active = 1)) as servicios_activos,
		(select count(*) from items i where (restaurant_id = idStore and i.is_active = 0)) as servicios_inactivos,
		r.address
	from restaurants r
	where r.id = idStore;
end
//
delimiter ;


-- 																Octubre 12, 2020

-- THIS STORED PROCEDURE FETCH THE NEW AND ACCEPTED ORDERS DATA, FILTERED BY RESTAURANT ID.
delimiter //
create procedure open_orders(in idStore int)
begin
	select od.id as _id, (select os.name from orderstatuses os where os.id = od.orderstatus_id) as order_current_status,
		od.created_at as order_creation_date, (select us.name from users us where us.id = od.user_id) as user_fullname,
		od.updated_at as order_acceptation_date
	from orders od
	where (od.orderstatus_id < 4 and od.restaurant_id = idStore)
	order by od.id asc;
end
//
delimiter ;


-- THIS STORED PROCEDURE FETCH THE RECORD ORDERS DATA, FILTERED BY RESTAURANT ID.
delimiter //
create procedure record_orders(in idStore int)
begin
	select * from (select od.id as _id, (select os.name from orderstatuses os where os.id = od.orderstatus_id) as order_current_status,
		od.updated_at as order_delivery_assigned_date, (select us.name from users us where us.id = od.user_id) as user_fullname,
		(select ad.created_at from accept_deliveries ad where ad.order_id = od.id) as picked_up_date,
		(select ad2.updated_at from accept_deliveries ad2 where ad2.order_id = od.id) as completed_date
	from orders od
	where (od.orderstatus_id > 2 and od.orderstatus_id < 6) and (od.restaurant_id = idStore)
	order by od.id desc
	limit 25) as allData order by allData._id asc;
end
//
delimiter ;


-- THIS STORED PROCEDURE IS TO FETCH THE DETAIL OF A NEW ORDER...
delimiter //
create procedure detail_new_order(in idOrder int)
begin
	select od.id as _id, od.unique_order_id as order_code,
		(select us.name from users us where us.id = od.user_id) as user_fullname,
		(select a.address from addresses a
			where a.id = (select usr.default_address_id from users usr where usr.id = od.user_id)) as address_name,
		od.created_at as order_creation_date, od.updated_at as order_delivery_assigned_date,
		(select ad.created_at from accept_deliveries ad where ad.order_id = od.id) as picked_up_date,
		(select ad2.updated_at from accept_deliveries ad2 where ad2.order_id = od.id) as completed_date,
		od.restaurant_id
	from orders od
	where od.id = idOrder;
end
//
delimiter ;


-- THIS STORED PROCEDURE IS TO FETCH DE ITEMS DETAIL NEW ORDER DATA...
delimiter //
create procedure items_detail_new_order(in idOrder int)
begin
	select id as _id, name as item_name, quantity as item_quantity from orderitems o
	where o.order_id = idOrder;
end
//
delimiter ;



-- 																		Octubre 13, 2020

-- THIS STORED PROCEDURE FETCH DELIVERY GUY DATA...
delimiter //
create procedure fetching_delivery_data(in idStore int)
begin
	select us.id as delivery_id, us.name as delivery_name
	from users us
	inner join restaurant_user ru on us.id = ru.user_id
	where (us.delivery_guy_detail_id != null or us.delivery_guy_detail_id != '') and (ru.restaurant_id = idStore);
end
//
delimiter ;


-- THIS STORED PROCEDURE CHANGE THE ORDER STATUS TO ACCEPTED...
delimiter //
create procedure change_to_accepted(in idOrder int)
begin
	update orders set orderstatus_id = 2, updated_at = (select now()) where id = idOrder;
end
//
delimiter ;


-- THIS STORED PROCEDURE CHANGE THE ORDER STATUS TO DELIVERY ASSIGNED...
delimiter //
create procedure change_to_delivery_assigned(in idOrder int, in idUserDelivery int)
begin

	update orders set orderstatus_id = 3, updated_at = (select now()) where id = idOrder;

	insert into accept_deliveries(order_id, user_id, customer_id, is_complete, created_at, updated_at)
	values (idOrder, idUserDelivery, (select od.user_id from orders od where od.id = idOrder), 0, (select now()), null);
end
//
delimiter ;


-- THIS STORED PROCEDURE IS TO CHANGE THE STATUS TO CANCELED...
delimiter //
create procedure change_to_canceled(in idOrder int)
begin

	update orders set orderstatus_id = 6, updated_at = (select now()) where id = idOrder;

end
//
delimiter ;
