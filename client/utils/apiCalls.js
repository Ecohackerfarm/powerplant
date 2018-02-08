/**
 * This file is for collecting the api calls from the client side.
 * So you can change api calls without changing
 * a lot of different implementations.
 *
 * Every api call should be able to call like this:
 * functionName({parameter}) => Promise
 *
 * e.g.:
 * getCropsByName(
 *   {  name : "foo",
 *      index : 0,
 *      length : 0,
 *   }
 * )
 */
import axios from 'axios';

/**
 * Gets crops by names
 * @param  {object} params					parameter object
 * @param  {string} params.name 		part of the crops name
 * @param  {number} params.index=0 	start index of the chunk of crops from found list
 * @param  {object} params.length=0 length of the chunk
 *
 * @return {Promise}       Promise
 */
export const getCropsByName = (params) => {
  return axios.get(
	  '/api/get-crops-by-name', {params}
	)
}

/**
 * Get compatible crop groups from
 * @param  {Object} params 					parameter object
 * @param  {Array} params.cropIds 	array of ids of crops
 * @return {Promise}       					Promise
 */
export const getCropGroups = (params) => {
	return axios.post(
		'/api/get-crop-groups',
		params
	)
}

/**
 * Get compatible crop groups from
 * @param  {Object} params 					parameter object
 * @param  {Array} params.cropIds 	array of ids of crops
 * @return {Promise}       					Promise
 */
export const getCompatibleCrops = (params) => {
	return axios.post(
		'/api/get-compatible-crops',
		params
	)
}

/**
 * Get locations from a specified user
 * @param  {object} params				parameter object
 * @param  {object} params.id 		user id
 *
 * @return {Promise}        			Promise
 */
export const getLocations = (params) => {
  return axios.get(
	  '/api/users/'+ params.id + '/locations'
	)
}


