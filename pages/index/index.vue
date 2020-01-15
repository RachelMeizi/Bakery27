<template>
	<view class="content">
		<view class="search">
			<uni-search-bar placeholder="搜索用户手机号或者姓名" @confirm="onSearch"></uni-search-bar>
		</view>
		<view class='order'>
			<view v-for='(items,index) in list'>
				<view class="ordertop">
					<text>{{items.name}}</text>
					<text @tap="makePhone(items.phone)">电话:{{items.phone}}</text>
				</view>
				<view class='goodscontent' v-for="item in  items.goods">
					<image :src="item.img!=''?item.img:'/static/logo2.png'"></image>
					<view class='allinfomation'>
						<view>
							<text>{{item.goodsName}}</text>
							<text>￥{{item.price}}</text>
						</view>
						<view class="">

						</view>
						<view class="">

						</view>
						<view class="">

						</view>
						<view class="">

						</view>
						<view class="">
							<text>x{{item.num}}</text>
						</view>

					</view>
				</view>
				<view class='all-price'>
					<view>{{items.time}}</view>
					<view>
						<text>共</text>
						<text v-if='items.goods'>{{items.goods.length}}</text>件商品，实付钱￥
						<text>{{items.allPrice}}</text>
					</view>
				</view>
				<!-- 用户 -->
				<view class='select'>
					<view @tap='updateList(items,index)'>编辑</view>
					<view @tap='finishList(items)'>完成</view>
				</view>

			</view>
			<view class="mask" @tap.stop="closePicker" catchtouchmove="true" v-if="showPop">
				<view class="goodsMask" v-if="showPop">
					<view class='maskGood' v-for="(item,index) in  maskgoods">
						<image :src="item.img"></image>
						<view class='maskGood-rightInfo'>
							<view>
								<text style="font-size: 30upx;font-weight: bold;">{{item.goodsName}}</text>
								<text>￥{{item.price}}</text>
							</view>
							<view class="goodNum">
								<text>x{{item.num}}</text>
								已领:<uni-number-box :min="0" :max="9" @change="changeNum($event,item,index)"></uni-number-box>

							</view>

						</view>
					</view>
					<view class='select2'>
						<view></view>
						<view @tap='updateSuccessList'>提交</view>
					</view>

				</view>

			</view>

		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox,
			uniSearchBar
		},
		data() {
			return {
				page: 1,
				showPop: false,
				maskgoods: [],
				list: [
					// {
					// 	id: 1, //列表编号
					// 	name: '李老师',
					// 	phone: '21121231',
					// 	time: '2019-12-10 10:55:22', //生成订单的时间
					// 	allPrice: '555', //
					// 	orderNum: '654654654654',
					// 	goods: [{ //打印
					// 			img: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550658037006&di=de9077ac6c152b305981bfc60a95cc14&imgtype=0&src=http%3A%2F%2Fpic19.nipic.com%2F20120216%2F1772123_170257337120_2.jpg", //商品照片
					// 			goodsName: "草莓慕斯", //商品名称
					// 			price: "12", //商品价格=数量*（彩印+黑白）
					// 			num: "1", //购买数量
					// 			id: 25,

					// 		},
					// 		{ //打印
					// 			img: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550658037006&di=de9077ac6c152b305981bfc60a95cc14&imgtype=0&src=http%3A%2F%2Fpic19.nipic.com%2F20120216%2F1772123_170257337120_2.jpg", //商品照片
					// 			goodsName: "雪媚娘", //商品名称
					// 			price: "12", //商品价格=数量*（彩印+黑白）
					// 			num: "1", //购买数量
					// 			id: 51,
					// 		},

					// 	],
					// },
					// {
					// 	name: '李老师',
					// 	phone: '21121231',
					// 	time: '2019-12-10', //生成订单的时间
					// 	allPrice: '555', //
					// 	orderNum: '654654654654',
					// 	goods: [{ //打印
					// 		img: '',
					// 		goodsName: "提拉米苏", //商品名称
					// 		price: "12", //商品价格=数量*（彩印+黑白）
					// 		num: "1", //购买数量
					// 		id: 2,
					// 	}, ],
					// }
				]
			}
		},
		onLoad() {
			this.getDataList(1)
			// this.$util.get('/admin/article/getOrderList?page=1').then(res=>{
			// 	this.list = res.data
			// })
		},
		onReachBottom() {
			let page = this.page
			page++
			this.page = page
			this.getDataList(page)
		},
		methods: {
			getDataList(page) {
				this.$util.get('/admin/article/getOrderList?page=' + page).then(
					res => {
						// this.list = res.data
						if (this.list.length == 0 && res.data.length > 0) {
							this.list = res.data
						} else if (this.list.length > 0 && res.data.length > 0) {
							this.list = [...this.list, ...res.data]
						} else if (res.data.length == 0) {
							uni.showToast({
								title: '没有更多数据了',
								icon: 'none'
							})
						}
					})
			},
			updateList(item, index) {
				this.showPop = true
				this.maskgoods = item.goods
				this.maskorderNum = item.orderNum

				console.log(this.maskgoods)
			},
			onSearch(e) {
				console.log(e.value) //搜索的值
				if (e.value == '') {
					this.list = []
					this.getDataList(1)
				} else {
					this.$util.get('/admin/article/searchOrderList?content=' + e.value).then(res => {
						this.list = res.data
					})
				}

			},
			makePhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone, //仅为示例
				})
			},
			finishList(e) {
				this.$util.get('/admin/article/endOrder?id=' + e.id).then(res => {
					this.list = []
					this.getDataList(1)
				})
			},
			updateSuccessList() {
				let json = {
					goods: this.maskgoods
				}
				this.$util.post('/admin/article/updateOrderDetail', JSON.stringify(json)).then(res => {
					this.list = []
					this.getDataList(1)
				})
				console.log(json, '编辑提交data');
			},
			closePicker() {
				this.showPop = false
			},
			changeNum(e, item, index) {
				// this.maskgoods[index].num

				this.maskgoods[index].receiveNum = e
				console.log(e, this.maskgoods, '444');
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100vh;
		background: #f5f5f9;
		/* display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
	}

	.search {
		width: 100%;
		display: flex;
		justify-content: center;
		align-content: center;
		background: #4dbac1;
	}

	.mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.goodsMask {
		width: 95%;
		background: #F2F2F2;
		margin: 0 auto;
		margin-top: 100upx;
		border-radius: 10upx;
		min-height: 500upx;
	}

	.maskGood {
		width: 95%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 20upx;
		font-size: 28upx;
		border-bottom: 1upx solid #ddd;
	}

	.maskGood>image {
		width: 150upx;
		height: 150upx;
		border-radius: 10upx;
	}

	.maskGood-rightInfo>view {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}


	.goodNum {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-flow: row;
		margin: 10upx;
	}

	.goodNum>text {
		margin-right: 100upx;
	}

	/* 订单 */

	.order {
		width: 100%;
		height: 100%;
		background: #fff;

	}

	.ordertop {
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10upx;
		border-bottom: 1upx solid #f2f2f2;
	}

	.ordertop text {
		margin: 10upx;
	}

	.ordertop text:last-child {
		color: gray;
		font-size: 26upx;
	}

	.goodscontent {
		width: 100%;
		margin-top: 20upx;
		background: #F2F2F2;
		min-height: 150upx;
	}


	.goodscontent>image {
		margin-left: 15upx;
		width: 130upx;
		height: 135upx;

		border-radius: 10%;
		float: left;
	}

	.allinfomation {
		width: 75%;
		float: left;
		margin-left: 10upx;
	}

	.allinfomation view {
		margin-top: 10upx;
		margin-left: 10upx;
		width: 100%;
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.allinfomation>view:first-child {
		font-size: 30upx;
		color: #000;
	}

	.allinfomation view {
		font-size: 27upx;
		color: gray;
	}

	/* 合计 */

	.all-price {
		/* text-align: right; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
		margin: 10upx;
		font-size: 26upx;
		color: #666;
		border-bottom: 1upx solid #f2f2f2;
		z-index: 1000;
	}

	.all-price text {
		/* color: red; */
		font-size: 32upx;
		font-weight: bold;
	}

	/* //支付按钮 */
	.select2 {
		margin: 0 auto;
		margin-top: 20upx;
		margin-bottom: 10upx;
		border-radius: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #4dbac1;
		color: #fff;
		width: 300upx;
		height: 80upx;
		line-height: 80upx;
	}

	.select {
		display: flex;
	}

	.select view {
		flex: 1;
		padding: 20upx;
		text-align: center;
		margin: 20upx 10upx;
	}

	.select>view:first-child {
		background: #fff;
		color: #4dbac1;
		border: 1upx solid #ddd;
	}

	.select>view:last-child {
		background: #4dbac1;
		color: #fff;
	}


	.tips {
		width: 100%;
		height: 70%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: column;
		font-size: 30upx;
	}

	.pai {
		width: 100upx;
		height: 100upx;
		margin: 30upx;
	}
</style>
