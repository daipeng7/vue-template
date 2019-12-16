
/*
 * @Author: daipeng
 * @Date: 2018-09-03 18:31:30
 * @LastEditors: VSCode
 * @LastEditTime: 2019-11-22 16:37:43
 * @Description: 接口map，可分割
 * @Company: 成都二次元动漫
 */
import { get, post, put } from '@/fetch/request';

const apiMap = {
	/**
     * basic
     */
	// queryRegions: get('/v1/basic/queryRegions'), // 查询城市/区域信息 data={level,parent_id?,id?,fields?}
	// ProductImageUpload: post('v1/product/ProductImageUpload'), // 上传素材 data={file}
};

export default apiMap;
