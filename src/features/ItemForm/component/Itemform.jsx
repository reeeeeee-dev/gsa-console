
import React, { useState } from 'react';
import styles from "./Itemform.module.scss";
import colors from "../../../common/styles/colors.module.scss";
import {TextField} from "../../../common/input/text_field/component/TextField";
import ImageUploading from "react-images-uploading";
import GridLoader from 'react-spinners/GridLoader';
import { X } from "react-feather";

export function ItemForm(props) {
	var {item, ...props} = props;
    const [loading, setLoading] = useState(false);
    const [productID, setProductID] = useState(item.productID || "");
    const [name, setName] = useState(item.name || "");
    const [price, setPrice] = useState(item.price || "");
    const [img, setImage] = useState(item.image || ""); //Update
	const [images, setImages] = useState([]); //for ImgHandler
    const [stock, setStock] = useState(item.stock || "");
    const [createdOn, setCreatedOn] = useState(item.createdOn || "");
	const [editImg, setEditImg] = useState(name === "");
	const user = JSON.parse(window.localStorage.getItem('user'));
	

	function registerProduct() {
		setLoading(true);
		if(validateEntries()) {

			var preRaw = {
				name,
				price,
				image: img,
				stock
			};
			var endpoint;
			if(typeof item.name !== "undefined") {
				endpoint = "https://gsa-backend-api.herokuapp.com/products/update";
				preRaw.productID = productID;
			} else {
				endpoint = "https://gsa-backend-api.herokuapp.com/products/new";
			}

			var rawItem = JSON.stringify(preRaw);

			fetch(endpoint, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: rawItem,
				redirect: 'follow'
			}).then(response => {
				if(response.status === 200) {
					alert("Item has successfully been registered!");
					props.close();
				} 
				else {
					alert("Error registering item! Please try again later or contact support at (479) 866-7051.");
				}
			})
			.catch(error => {
				console.error(error);
				alert("Error registering item! Please try again later or contact sales support at (479) 866-7051.")
			})
	 		.finally(() => setLoading(false));
		} 
		else {
			setLoading(false);
		}
	}

	function clearEntries() {
		setProductID("");
		setName("");
		setPrice("");
		setImage("");
		setStock("");
		setCreatedOn("");
	}

	function validateEntries() {
		if(name === "") {
			alert("Item name should not be empty!");
			return false;
		}
		if(price === "" || !(/^(([1-9]\d)|0)+\.\d{2}$/).test(price)) {
			alert("Item does not have a price!");
			return false;
		}
		if(stock === "" || !(/^[0-9]+$/.test(stock))) {
			alert("Stock input is invalid!");
			return false;
		}
		if(img === "") {
			alert("Item does not have an image!");
			return false;
		}
		return true;
	}

	function ImgHandler() {
		
		const onChange = (imageList, addUpdateIndex) => {
			setImages(imageList);
		};

		function hideBtn(hide)
		{
			var btn = document.getElementById("UploadButton");
			if(hide)
				btn.style.display = "none";
			else
				btn.style.display = "inline-block";
		}
		if(editImg) {
			return(
				<div className="ImgHandler">
					<ImageUploading
						value = {images}
						onChange = {onChange}
						acceptType = {['jpg', 'png', 'jpeg']}
						dataURLKey = "data_url"
					>
						{({imageList, onImageUpload, onImageRemove, isDragging, dragProps}) => (
							<div className = {styles.image_wrap}>
								<button 
									id = {"UploadButton"}
									className = {styles.button}
									style = {isDragging ? { color: "#b3cae5" } : null}
									onClick = {onImageUpload}
									{...dragProps}
								>
									Click or Drop Image Here
								</button>
								{imageList.map((image, index) => (
									<div key = {index} className = {styles.image_item} >
										<img 
											className ={styles.image} 
											src = {image.data_url} 
											alt = "" width = "300" 
											onLoad = {() => {
												setImage(image.data_url);
												hideBtn(true);
											}}
										/>
										<div className = {styles.button_wrap}>
											<button 
												className = {styles.button2} 
												onClick = {() => {
													onImageRemove(index); 
													hideBtn(false);
												}} 
											> 
												X 
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</ImageUploading>
				</div>
			);
		} else {
			return <img className={styles.image} src={item.image} />
		}
	}
    return (
        <div className={styles.rootDiv}>
            <div className={styles.block}>
				<button
					className={styles.closeBtn}
					onClick={props.close}
				>
					<X />
				</button>
				<div className={styles.content}>
					{
						productID !== "" ?
							<TextField
								className={styles.field}
								label="Product ID"
								disabled={true}
								placeholder="Ex. 12345"
								value={productID}
								onChange={e => setProductID(e.target.value)}
							/>
						: null
					}
					<TextField
						className={styles.field}
						label="Product Name"
						placeholder="Ex. Pills"
						value={name}
						disabled={!user.manager}
						onChange={e => setName(e.target.value)}
						/>
					<TextField
						className={styles.field}
						disabled={!user.manager}
						label="Product Price"
						placeholder="Ex. 15.00"
						value={price}
						onChange={e => setPrice(e.target.value)}
						/>
					<TextField
						className={styles.field}
						disabled={!user.manager}
						label="Current Stock"
						placeholder="Ex. 30"
						value={stock}
						onChange={e => setStock(e.target.value)}
						/>
					<div className = {styles.TextFieldHeader}>Upload Image</div>
					{
						(user.manager && item.name !== undefined) ?
							<div className={styles.editImage}>
								<input
									type="checkbox"
									checked={editImg}
									onChange={(e) => {
										setEditImg(e.target.checked);
									}}
								/>
								Edit Image?
							</div>
						: null
					}
					<ImgHandler/>

					{
						user.manager ?
							<div className={styles.editImage}>
								<button 
									className={styles.button}
									onClick={registerProduct}
								>
									{ loading ? 
										<GridLoader color={colors.light} size={15} />
										: "Upload Item Data"
									}
								</button>
							</div>
						: null
					}
				</div>
            </div>
        </div>
    )
}

export default ItemForm;