import {
	STORE_IS_LOADED,
	SET_HEADER_TITLE
} from './types';


/**
 * returns action object when the store is loaded
 * @return {object} action object
 */
export const storeIsLoaded = () =>{
 return {
 	type : STORE_IS_LOADED,
 	storeIsLoaded : true
 }
};

/**
 * sets the header title from param title
 * @param  {string} title
 * @return {object} action object
 */
export const setHeaderTitle = ( title ) => {
  return {
  	type:  SET_HEADER_TITLE,
  	title
  };
}
