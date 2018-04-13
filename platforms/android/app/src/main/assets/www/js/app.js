function Task(name, date) {

	this.date = date
	this.name = name

}

//document.addEventListener('deviceready', initVue, false);
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
				document.getElementById('nav-app').style.display = "none"
			} else {
				document.getElementById('nav-app').style.display = "table"
			}
		}

	}
});

navApp = new Vue({
	el: '#nav-app',
	methods: {
		switchToDeleted() {
			app.$data.taskStore['history'].currentList = 'deletedTasks'
		},
		switchToCompleted() {
			app.$data.taskStore['history'].currentList = 'completedTasks'
		}


	}
})

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
	myDB.init().then(
		function(db) {
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