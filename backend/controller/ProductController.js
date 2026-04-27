import product from '../models/productModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';


//creating product
export const createProduct = handleAsyncError(async (req, res, next) => {
   req.body.user   = req.user.id;
   const createdProduct = await product.create(req.body);
   res.status(201).json({
    success: true,
    product: createdProduct
   })
});

//get all product
export const getAllProducts =handleAsyncError(async (req, res, next) => {
    const resultPerPage = 3;
  const apiFeatures =  new APIFunctionality(product.find(), req.query).search().filter().pagination(3);
  
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();
  
  const totalPages = Math.ceil(productCount / resultPerPage);
  const page = Number(req.query.page) || 1;
  
  if(page > totalPages && productCount > 0){
      return next(new HandleError("Invalid page number", 400))
  }

  //paggination
  apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    if(!products || products.length === 0){
        return next(new HandleError("No products found", 404));
    }
    res.status(200).json({
      success: true,
      products,
      productCount,
      resultPerPage,
      totalPages,
      currentPage: page
    })
    
});


//update product
export const updateProduct = handleAsyncError(async(req, res, next) => {
    let update = await product.findById(req.params.id)
    if(!update){
        return next(new HandleError("product not found", 500))
    }

    update = await product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        update
    })
   

  
});

//Delete product

export const deleteProduct = handleAsyncError(async(req, res, next) => {
    const deleteProduct = await product.findById(req.params.id)
    if(!deleteProduct){
        return next(new HandleError("product not found", 404))
    }

    await product.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })

//get single product
    

})


export const getSingleproduct = handleAsyncError(async(req, res, next) =>{
    const singleProduct = await product.findById(req.params.id)
    if(!singleProduct){
        return next(new HandleError("product not found", 404))
    }
    res.status(200).json({
        success: true,
        product: singleProduct
    })

})


//creating and updating review
export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
        const {rating,comment,productId} = req.body || {};

        if (!rating || !comment || !productId) {
            return next(new HandleError("Please provide rating, comment and productId", 400));
        }

        const review ={
            user: req.user._id,
            name: req.user.name,
            rating:Number(rating),
            comment
        }

        const foundProduct = await product.findById(productId);

        if (!foundProduct) {
            return next(new HandleError("Product not found", 404));
        }

        const reviewExists = foundProduct.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

        if(reviewExists){
            foundProduct.reviews.forEach((rev) => {
                if(rev.user.toString() === req.user._id.toString()){
                    rev.rating = rating;
                    rev.comment = comment;
                }
            });
        }else{
            foundProduct.reviews.push(review);
            foundProduct.numberOfReviews = foundProduct.reviews.length;
        }

        // Calculate average rating
        let avg = 0;
        foundProduct.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        foundProduct.ratings = foundProduct.reviews.length > 0 ? avg / foundProduct.reviews.length : 0;

        await foundProduct.save({validateBeforeSave:false});

        res.status(200).json({
            success:true,
            message: "Review added/updated successfully",
            product
        })
})


//Getting review
export const getProductReviews = handleAsyncError(async (req, res, next) => {
    const getproduct = await product.findById(req.query.productId)
    if(!getproduct){
        return next(new HandleError("Product not found", 400))
    }

    res.status(200).json({
        success: true,
        reviews: getproduct.reviews
    })
})

//Deleting review
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const deleteProduct = await product.findById(req.query.productId)
    
    if(!deleteProduct){
        return next(new HandleError("Product not found", 400))
    }

    const reviewId = req.query.reviewId || req.query.id;
    if(!reviewId){
        return next(new HandleError("Review id is required", 400))
    }

    const reviews = deleteProduct.reviews.filter(review => review._id.toString() !== reviewId.toString());


    if(reviews.length === deleteProduct.reviews.length){
        return next(new HandleError("Review not found for this product", 404))
    }

    deleteProduct.reviews = reviews;
    deleteProduct.numberOfReviews = reviews.length;

    let avg = 0;
    deleteProduct.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    deleteProduct.ratings = deleteProduct.reviews.length > 0 ? avg / deleteProduct.reviews.length : 0;

    await deleteProduct.save();

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        reviews: deleteProduct.reviews
    })

})

//Admin getting all products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await product.find();
    res.status(200).json({
        success:true,
        products
    })

})

