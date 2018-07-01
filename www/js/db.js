var myDB = (function() {

	const DB_VERSION = 1;

	function getDBVersion() {

		var storage = window.localStorage;
		var value = storage.getItem("DB_VERSION"); // Pass a key name to get its value.
		if (value == null) {
			return 0;
		}
		return parseInt(value);
	}

	function setDBVersion(version) {

		var storage = window.localStorage;
		storage.setItem("DB_VERSION", version); // Pass a key name and its value to add or update that key.     }
	}

	function init() {
		//TODO: catch error on open db 

		var promise = new Promise(function(resolve, reject) {

			var db = window.sqlitePlugin.openDatabase({
				name: 'myDB.db',
				location: 'default'
			});


			var lastVersion = getDBVersion();
			if (DB_VERSION > lastVersion) { // TODO: change to callback after 

				for (var i = lastVersion; i <= DB_VERSION; i++) {
					switch (i) {
						case 0:


							db.sqlBatch([
									'CREATE TABLE if not EXISTS  `tbl_task` ( `taskId` INTEGER PRIMARY KEY AUTOINCREMENT,  `name`  TEXT NOT NULL,  `firstPlanDate` text NOT NULL  )',
									'CREATE TABLE if not EXISTS  `tbl_task_completed` ( `taskId` INTEGER PRIMARY KEY AUTOINCREMENT,  `name`  TEXT NOT NULL,  `firstPlanDate` text  NOT NULL, `closeDate` text NOT NULL   )',
									'CREATE TABLE if not EXISTS  `tbl_task_deleted` ( `taskId` INTEGER PRIMARY KEY AUTOINCREMENT,  `name`  TEXT NOT NULL,  `firstPlanDate` text NOT NULL, `closeDate` text NOT NULL   )',
									//'create index if not EXISTS  i_tbl_task on tbl_task (  firstPlanDate ASC ) ',

									'create index if not EXISTS  i_tbl_task_completed on tbl_task_completed (  closeDate ASC ) ',
									'create index if not EXISTS  i_tbl_task_deleted  on tbl_task_deleted (  closeDate ASC ) '
								], function() {
									console.log('Populated database OK');

									setDBVersion(1);
									resolve(returnObject);
								},
								function(error) {
									console.log('SQL batch ERROR: ' + error.message);
									//TODO: emmit error 
								});


							break;

						default:
							break;
					}
				}

			}


			function dateToYMD(date) {
				var d = date.getDate();
				var m = date.getMonth() + 1;
				var y = date.getFullYear();
				return y + (m <= 9 ? '0' + m : m) + (d <= 9 ? '0' + d : d);
			}

			function getNow() {
				return dateToYMD(new Date())

			}

			function getTomorrow() {
				return dateToYMD(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
			}

			function doneOrDeleteTask(taskId, targetTable) {
				db.sqlBatch([
						["insert into " + targetTable + " select taskId,name,firstPlanDate, ? from tbl_task where taskId = ?  ", [getNow, taskId]],
						["delete from tbl_task where taskId = ? ", [taskId]]

					], function() {
						console.log('Populated database OK');
					},
					function(error) {
						console.log('SQL batch ERROR: ' + error.message);
						//TODO: emmit error 
					});


			}

			var returnObject = {
				doneTask(taskId) {
					doneOrDeleteTask(taskId, "tbl_task_completed")

				},
				deleteTask(taskId) {
					doneOrDeleteTask(taskId, "tbl_task_deleted")

				},
				addTask(name, toToday, callback) {
					var targetDate = toToday ? getNow() : getTomorrow();
					db.sqlBatch([
							["insert into  tbl_task (name,firstPlanDate) values ( ? , ? ) ", [name, targetDate]]

						], function() {
							console.log('addTask to database OK');
							callback();

						},
						function(error) {
							console.log('SQL batch ERROR: ' + error.message);
							//TODO: emmit error 
						});
				},
				updateTask(task, table) {
					db.sqlBatch([
							["update " + table + " set name =  ? where taskId = ?  ", [task.name, task.taskId]]

						], function() {
							console.log('update to database OK');

						},
						function(error) {
							console.log('SQL batch ERROR: ' + error.message);
							//TODO: emmit error 
						});
				},
				moveTaskBackTo(taskId, isDeleted, toToday) {
					var sourceTable = isDeleted ? "tbl_task_deleted" : "tbl_task_completed";
					var targetDate = toToday ? getNow() : getTomorrow();
					db.sqlBatch([
							["insert into  tbl_task select taskId,name,'" + targetDate + "' from " + sourceTable + " where taskId = ?  ", [taskId]],
							["delete from " + sourceTable + " where taskId = ? ", [taskId]]

						], function() {
							console.log('Populated database OK');


						},
						function(error) {
							console.log('SQL batch ERROR: ' + error.message);
							//TODO: emmit error 
						});

				},
				fetchTasks(callback, table, firstPlanDate, rowCount, offset) {
					var wherecause = " ";
					if (firstPlanDate != null && firstPlanDate != 'history') {
						wherecause = firstPlanDate == "today" ? " where firstPlanDate <= '" + getNow() + "'" :
							" where firstPlanDate > '" + getNow() + "'";
					}

					var orderField = table == 'tbl_task' ? 'firstPlanDate' : 'closeDate';
					var sql = "SELECT  * from " + table + wherecause + " order by " + orderField + " ASC LIMIT ? OFFSET ?";
					console.log("fetch with sql ", sql);
					db.executeSql(sql, [rowCount, offset], function(resultSet) {
						var data = [];
						for (var i = 0; i < resultSet.rows.length; i++) {
							data.push(new Task(resultSet.rows.item(i).name, resultSet.rows.item(i).firstPlanDate, resultSet.rows.item(i).taskId));
						}
						//$ee.trigger("fetchToday", [data]);
						console.log("call callback", data)
						callback(data)

					}, function(error) {
						console.log('SELECT error: ' + error.message);
					});
				}
			};
			console.log("what version now ? " + getDBVersion())
			if (getDBVersion() == DB_VERSION) {

				resolve(returnObject);


			} else {
				reject("");
			}
		});
		return promise;
	}


	//TODO: impl update/insert/search 
	return {
		"init": init
	};

})()