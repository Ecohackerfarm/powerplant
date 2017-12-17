import {
	STORE_IS_LOADED,
	SET_HEADER_TITLE
} from './types';

export const storeIsLoaded = () =>{
 return {
 	type : STORE_IS_LOADED,
 	storeIsLoaded : true
 }
};

export const setHeaderTitle = ( title ) => {
  return {
  	type:  SET_HEADER_TITLE,
  	title
  };
}
