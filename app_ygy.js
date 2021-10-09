/*

注册地址：https://admin.yoo-woo.com/#/register

变量： app_ygy:手机号#密码
export app_ygy='手机号#密码'
*/

// [task_local]
//#御果园
// 10 0 * * * https://raw.githubusercontent.com/lujin200114/fire/main/app_ygy.js, tag=御果园APP, enabled=true


const $ = new Env('御果园APP签到');
const notify = $.isNode() ? require('./sendNotify') : '';
message = ""
let status;
status = (status = ($.getval("ygystatus") || "1")) > 1 ? `${status}` : ""; // 账号扩展字符
let app_ygyArr = []
let app_ygy = $.isNode() ? (process.env.app_ygy ? process.env.app_ygy : "") : ($.getdata('app_ygy') ? $.getdata('app_ygy') : "")
let app_ygys = ""
//
!(async() => {
  if (typeof $request !== "undefined") {
    // ygyck()
  } else {
    if (!$.isNode()) {
      app_ygyArr.push($.getdata('app_ygy'))
      let ygycount = ($.getval('ygycount') || '1');
      for (let i = 2; i <= ygycount; i++) {
        app_ygyArr.push($.getdata(`app_ygy${i}`))
      }
      console.log(`-------------共${app_ygyArr.length}个账号-------------\n`)
      for (let i = 0; i < app_ygyArr.length; i++) {
        if (app_ygyArr[i]) {
          app_ygy = app_ygyArr[i];
          $.index = i + 1;
          console.log(`\n开始【御果园账户 ${$.index}】`) 
          zhanghu=app_ygy.split('#')
          user=zhanghu[0]
          mima=zhanghu[1]
          await login();//登录获取token
        }
      }
    } else {
      if (process.env.app_ygy && process.env.app_ygy.indexOf('@') > -1) {
        app_ygyArr = process.env.app_ygy.split('@');
        console.log(`您选择的是用"@"隔开\n`)
      } else {
        app_ygys = [process.env.app_ygy]
      };
      Object.keys(app_ygys).forEach((item) => {
        if (app_ygys[item]) {
          app_ygyArr.push(app_ygys[item])
        }
      })
      console.log(`共${app_ygyArr.length}个账号`)
      for (let k = 0; k < app_ygyArr.length; k++) {
        $.message = ""
        app_ygy = app_ygyArr[k]
        $.index = k + 1;
        console.log(`\n开始【御果园账户 ${$.index}】`)
        zhanghu=app_ygy.split('#')
        user=zhanghu[0]
        mima=zhanghu[1]
        await login();//登录获取token
      }
    }
    
  }
})()
  .catch ((e) => $.logErr(e))
  .finally(() => $.done())

//登录
function login(timeout = 0) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/index/login`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
    },
      body: `{"username":"${user}","password":"${mima}","token":null}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
           token = result.data.token
           $.log(`\ntoken获取成功`)
           await $.wait(3000);
           await xinxi(token);//树信息
           await $.wait(3000);
           await sign(token);//签到
		   await $.wait(3000);
		   await qiandaonum();//签到天数
		   await $.wait(3000);
           await qiandaogoodslist()
           await $.wait(3000);
           await getChizaocanEventList(token)
           await $.wait(3000);
           await getChiwucanEventList(token)
           await $.wait(3000);
           await getChiwancanEventList(token)
           await $.wait(3000);
		   await getask(token)//答题
           await $.wait(3000); //图片答题
           await getAnswer(token)
		   await $.wait(5000)
		   await getSportEventList(token)
           await $.wait(5000)
           await getMormingEventList(token)
           await $.wait(5000)
           await getYueduEventList(token)
           await $.wait(3000);
           await getNightEventList(token)
           await $.wait(5000)
           $.log('\n开始看视频')
           await getIntegralByVideo(29)
           await $.wait(5000)
           await getIntegralByVideo(18)
           await $.wait(5000)
           await getIntegralByVideo(27)
           await $.wait(5000)
           await getIntegralByVideo(23)
           $.log('\n看视频结束')
           await $.wait(3000);
           $.log('\n开始施肥')
           await shifei(token)
           $.log('\n施肥结束')
           await $.wait(5000)
           $.log('\n开始浇水')
           await jiaoshui(token)
           $.log('\n浇水结束')

           


		   
         } else {
           $.log(`\n请填写正确的手机号和密码`)
         }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, timeout)
  })
}


//签到
function sign(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/user_sign/signDay`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n签到成功获得现金` + result.data.sign_count)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//获取签到奖励列表
function qiandaogoodslist(timeout = 0) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/user/qiandaogoodslist`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n签到奖励信息：` + result.data.list[0]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[1]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[2]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[3]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[4]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[5]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[6]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[7]['goods_name'])
          $.log(`\n签到奖励信息：` + result.data.list[8]['goods_name'])
         
          $.message += `\n签到奖励信息：` + result.data.list[0]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[1]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[2]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[3]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[4]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[5]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[6]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[7]['goods_name']
          $.message += `\n签到奖励信息：` + result.data.list[8]['goods_name']
          
        } else {
          $.log(`\n没有获取到奖励列表`)
          $.message += `n没有获取到奖励列表`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, timeout)
  })
}

//签到天数
function qiandaonum(timeout = 0) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/user/qiandaonum`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n已成功签到` + result.data.qdnum + `天`)
          $.message += `\n已成功签到` + result.data.qdnum + `天`
          } else {
          $.log(`\n没有获取到签到天数`)
          $.message += `\n没有获取到签到天数`
        }
          
          if (result.data.qdnum == 3) {
            await $.wait(10000);
            await qiandao(1)
          }
          if (result.data.qdnum == 10) {
            await $.wait(10000);
            await qiandao(2)
          }
          if (result.data.qdnum == 28) {
            await $.wait(10000);
            await qiandao(3)
          }
          if (result.data.qdnum == 42) {
            await $.wait(10000);
            await qiandao(4)
          }
          if (result.data.qdnum == 63) {
            await $.wait(10000);
            await qiandao(5)
          }
          if (result.data.qdnum == 91) {
            await $.wait(10000);
            await qiandao(6)
          }
          if (result.data.qdnum == 126) {
            await $.wait(10000);
            await qiandao(7)
          }
          if (result.data.qdnum == 168) {
            await $.wait(10000);
            await qiandao(8)
          }
          if (result.data.qdnum == 210) {
            await $.wait(10000);
            await qiandao(9)
          }
          
          
        
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, timeout)
  })
}

//签到兑换奖励
function qiandao(num) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/user/qiandao`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"type":${num},"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n兑换成功：` + result.info)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//晚饭
function getChiwancanEventList(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/index/getChiwancanEventList`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        {
        if (result.data.list[0].status==2) {
             $.log('\n吃晚饭' + result.data.list[0]['status_text'])
			
          
        } else {
            await takeExercises(12)
            await $.wait(605000)
            await receiveRewardsExercises(12)
          $.log('\n吃晚饭完成' )
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
         
    }, 0)
  })
}
//午饭
function getChiwucanEventList(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/index/getChiwucanEventList`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        {
        if (result.data.list[0].status==2) {
             $.log('\n吃午饭' + result.data.list[0]['status_text'])
			
          
        } else {
            await takeExercises(11)
            await $.wait(605000)
            await receiveRewardsExercises(11)
          $.log('\n吃午饭完成' )
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
         
    }, 0)
  })
}
//早饭
function getChizaocanEventList(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/index/getChizaocanEventList`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        {
        if (result.data.list[0].status==2) {
             $.log('\n吃早饭' + result.data.list[0]['status_text'])
			
          
        } else {
            await takeExercises(9)
            await $.wait(605000)
            await receiveRewardsExercises(9)
          $.log('\n吃早饭完成' )
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
         
    }, 0)
  })
}
//树信息
function xinxi(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/tree/getSeedTask`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          seed_task_uuid = result.data.seed_task_uuid
          $.log(`\nseed_task_uuid获取成功`)
          $.message += `\nseed_task_uuid获取成功`
     
          seed_id = result.data.seed_id
          
          $.log(`\nseed_id获取成功开始执行签到`)
          $.message += `\nseed_id获取成功开始执行签到`
          await $.wait(1000);
          
        } else {
          $.log(`\n请填写正确的手机号和密码`)
          $.message += `\n请填写正确的手机号和密码`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//答题
function getask(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/index/getask`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"id":49,"key":4,"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n` + result.info)
		  await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))
		  await getask(token)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//图片答题
function getAnswer(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/index/getAnswer`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"type":3,"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n` + result.info)
		  await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))
		  await getAnswer(token)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
  //开始做运动
function getSportEventList(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://admin.yoo-woo.com/api/index/getSportEventList`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.data.list[4].status==0) {
            
          $.log(`\n开始做运动，请耐心等待`)
          
        
        
			await takeExercises(1)
			await $.wait(60000)
			await receiveRewardsExercises(1)
            await $.wait(1000)
            
        
			await takeExercises(2)
			await $.wait(240000)
			await receiveRewardsExercises(2)
            await $.wait(1000)

			await takeExercises(3)
			await $.wait(240000)
			await receiveRewardsExercises(3)
            await $.wait(1000)


			await takeExercises(4)
			await $.wait(300000)
            await receiveRewardsExercises(4)
            await $.wait(1000)



			await takeExercises(5)
			await $.wait(300000)
			await receiveRewardsExercises(5)
            await $.wait(1000)

			
            } else 
            {
          $.log(`\n今天的运动结束了，小老弟`)
          }
          
        
			
		
        
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//早睡信息
function getNightEventList(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/index/getNightEventList`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        {
        if (result.data.list[0].status==2) {
             $.log('\n早睡打卡' + result.data.list[0]['status_text'])
			
          
        } else {
            await takeExercises(7)
            await $.wait(65000)
            await receiveRewardsExercises(7)
          $.log('\n早睡打卡完成' )
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
         
    }, 0)
  })
}
//早起信息
function getMormingEventList(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/index/getMormingEventList`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        {
        if (result.data.list[0].status==2) {
             $.log('\n早起打卡' + result.data.list[0]['status_text'])
			
          
        } else {
            await takeExercises(6)
            await $.wait(65000)
            await receiveRewardsExercises(6)
          $.log('\n早起打卡完成' )
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
         
    }, 0)
  })
}
//阅读
function getYueduEventList(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/index/getYueduEventList`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        {
        if (result.data.list[0].status==2) {
             $.log('\n阅读' + result.data.list[0]['status_text'])
			
          
        } else {
            await takeExercises(10)
            await $.wait(65000)
            await receiveRewardsExercises(10)
          $.log('\n阅读已完成' )
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
         
    }, 0)
  })
}
//做运动
function takeExercises(num) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `http://admin.yoo-woo.com/api/index/takeExercises`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'aapplication/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"sid":${num},"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        
        {
        if (result.code == 1) {
          $.log(`\n` + result.info)
        } else {
          $.log('\n1' + result.info)
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//收运动奖励
function receiveRewardsExercises(num) {
    
  return new Promise((resolve) => {
   
	let url = {
      url: `http://admin.yoo-woo.com/api/index/receiveRewardsExercises`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'aapplication/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"sid":${num},"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n` + result.info)
        } else {
          $.log('\n2' + result.info) 
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//看视频
function getIntegralByVideo(num) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/tree/getIntegralByVideo`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"id":${num},"token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        
        {
        if (result.code == 1) {
          $.log(`\n` + result.info)
        } else {
          $.log('\n' + result.info)
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//浇水
function jiaoshui(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/tree/seedAction`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"seed_task_uuid": "${seed_task_uuid}","action_type": "drop","token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        
        if (result.code == 1) {
          $.log(`\n` + result.info)
		  await $.wait(Math.floor(Math.random()*(8000-3000+1000)+3000))
		  await jiaoshui(token)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}
//施肥
function shifei(token) {
    
  return new Promise((resolve) => {
    
	let url = {
      url: `https://admin.yoo-woo.com/api/tree/seedAction`,
      headers: {
        'Host': 'admin.yoo-woo.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'https://www.yoo-woo.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer' : 'https://www.yoo-woo.com/'
      },
      body: `{"seed_task_uuid": "${seed_task_uuid}","action_type": "manure","token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        
        if (result.code == 1) {
          $.log(`\n` + result.info)
		  await $.wait(Math.floor(Math.random()*(8000-3000+1000)+3000))
		  await shifei(token)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:h}=t;e(null,{status:i,statusCode:r,headers:o,rawBody:h},s.decode(h,this.encoding))},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="aapplication/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:h}=t;e(null,{status:s,statusCode:r,headers:o,rawBody:h},i.decode(h,this.encoding))},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
