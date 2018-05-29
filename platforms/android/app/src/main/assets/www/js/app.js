function Task(name, date) {

	this.date = date
	this.name = name

}

var $ee = new EventEmitter();
document.addEventListener('deviceready', initDB, false); //TODO , check if  device have been ready
var app = null;
var navApp = null;

app = new Vue({
	el: '#app',
	data: {
		currentCategory: 'today',
		taskStore: {
			"history": {
				"displayName": "History",
				"currentList": 'completedTasks',
				"completedTasks": [
					new Task("Hisotry task1 ", new Date()),
					new Task("Hisotry task2 ", new Date()),
					new Task("Hisotry task3 ", new Date()),
					new Task("Hisotry task4 ", new Date())
					/*,
					new Task("Hisotry task1 ", new Date()),
					new Task("Hisotry task2 ", new Date()),
					new Task("Hisotry task3 ", new Date()),
					new Task("Hisotry task4 ", new Date()),
					new Task("Hisotry task1 ", new Date()),
					new Task("Hisotry task2 ", new Date()),
					new Task("Hisotry task3 ", new Date()),
					new Task("Hisotry task4 ", new Date()),
					new Task("Hisotry task1 ", new Date()),
					new Task("Hisotry task2 ", new Date()),
					new Task("Hisotry task3 ", new Date()),
					new Task("Hisotry task4 ", new Date())
					*/


				],
				"deletedTasks": [
					new Task("Deleted task1 ", new Date()),
					new Task("Deleted task2 ", new Date()),
					new Task("Deleted task3 ", new Date()),
					new Task("Deleted task4 ", new Date()),
					new Task("Deleted task1 ", new Date()),
					new Task("Deleted task2 ", new Date()),
					new Task("Deleted task3 ", new Date()),
					new Task("Deleted task4 ", new Date()),
					new Task("Deleted task1 ", new Date()),
					new Task("Deleted task2 ", new Date()),
					new Task("Deleted task3 ", new Date()),
					new Task("Deleted task4 ", new Date()),
					new Task("Deleted task1 ", new Date()),
					new Task("Deleted task2 ", new Date()),
					new Task("Deleted task3 ", new Date()),
					new Task("Deleted task14 ", new Date())
				],
			},
			"today": {
				"displayName": "Today",

				"tasks": [new Task("Today task1 ", new Date()),
					new Task("Today task2 ", new Date()),
					new Task("Today task3 ", new Date()),
					new Task("Today task4 ", new Date())
				]
			},

			"tomorrow": {
				"displayName": "Tomorrow",

				"tasks": [
					new Task("Tomorrow task1 ", new Date()),
					new Task("Tomorrow task2 ", new Date()),
					new Task("Tomorrow task3 ", new Date()),
					new Task("Tomorrow task4 ", new Date())
				]

			},
		}

	},
	methods: {
		initDB(db) {
			var self = this
			//$ee.on("fetchToday", this.loadToday.bind(this));
			console.log("now start fetchTasks ");
			db.fetchTasks(function(data) {
					self.onLoadData("today", "tasks", data)
				},
				"tbl_task", "today", 200, 0);
			db.fetchTasks(function(data) {
					self.onLoadData("tomorrow", "tasks", data)
				},
				"tbl_task", "tomorrow", 200, 0);

		},
		onLoadData(target, subTarget, data) {

			console.log("now loadToday ", this.taskStore[target][subTarget], data);

			//this.taskStore.today.tasks.splice(0, this.taskStore.today.tasks.length, data);
			Vue.set(this.taskStore[target], subTarget, data)
			console.log("now loadToday 2", this.taskStore[target][subTarget], data);

		},

		done(task, index, tasklist, event) {

			mui.toast("Task Completed , You can get it back in history list ");
			mui.swipeoutClose(event.target.parentNode.parentNode);

			tasklist.tasks.splice(index, 1);
			this.taskStore['history'].completedTasks.splice(0, 0, task);


		},
		deleteTask(task, index, tasklist, event) {
			mui.toast("Task Deleted , You can get it back in garbage list ");
			mui.swipeoutClose(event.target.parentNode.parentNode);
			tasklist.tasks.splice(index, 1);
			this.taskStore['history'].deletedTasks.splice(0, 0, task);
		},
		moveTo(task, index, targetCategory, event) {

			mui.toast("Task moved to " + this.taskStore[targetCategory].displayName);
			mui.swipeoutClose(event.target.parentNode.parentNode);
			var self = this;

			var historyList = self.taskStore['history']
			historyList[historyList.currentList].splice(index, 1);
			self.taskStore[targetCategory].tasks.splice(0, 0, task);

		},
		switchToCategory(category) {
			this.currentCategory = category;
			if (category !== 'history') {
				document.getElementById('nav-history').style.display = "none"
				document.getElementById('nav-new').style.display = "table"
			} else {
				document.getElementById('nav-history').style.display = "table"
				document.getElementById('nav-new').style.display = "none"
			}
		}

	}
});

navApp = new Vue({
	el: '#nav-history',
	methods: {
		switchToDeleted() {
			app.$data.taskStore['history'].currentList = 'deletedTasks'
		},
		switchToCompleted() {
			app.$data.taskStore['history'].currentList = 'completedTasks'
		}


	}
})

app.switchToCategory('today')

mui.init({
	swipeBack: false
});
(function($) {
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	var html2 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第二个选项卡子项-1</li><li class="mui-table-view-cell">第二个选项卡子项-2</li><li class="mui-table-view-cell">第二个选项卡子项-3</li><li class="mui-table-view-cell">第二个选项卡子项-4</li><li class="mui-table-view-cell">第二个选项卡子项-5</li></ul>';
	var html3 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第三个选项卡子项-1</li><li class="mui-table-view-cell">第三个选项卡子项-2</li><li class="mui-table-view-cell">第三个选项卡子项-3</li><li class="mui-table-view-cell">第三个选项卡子项-4</li><li class="mui-table-view-cell">第三个选项卡子项-5</li></ul>';
	var item2 = document.getElementById('item2mobile');
	var item3 = document.getElementById('item3mobile');
	/*  document.getElementById('slider').addEventListener('slide', function(e) {
	      if (e.detail.slideNumber === 1) {
	          if (item2.querySelector('.mui-loading')) {
	              setTimeout(function() {
	                  item2.querySelector('.mui-scroll').innerHTML = html2;
	              }, 500);
	          }
	      } else if (e.detail.slideNumber === 2) {
	          if (item3.querySelector('.mui-loading')) {
	              setTimeout(function() {
	                  item3.querySelector('.mui-scroll').innerHTML = html3;
	              }, 500);
	          }
	      }
	  });*/

	$('#OA_task_2').on('slideleft', '.mui-table-view-cell', function(event) {
		alert('ok left ');

	});


})(mui);

function initDB() {
	console.log("now initDB db");
	myDB.init().then(
		function(db) {
			console.log("now initDB db done");
			app.initDB(db);
		},
		function(err) {
			//TODO : handel error 
			//doInitVue();
		}
	);

}
// doInitVue()
//initVue();