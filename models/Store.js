const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // the author is a reference to the user
    required: 'You must supply an author.'
  }, 
}, {
  toJSON: { virtuals: true },
  toObject:  {virtuals: true }
});

// Define index
storeSchema.index({
  name: 'text',
  description: 'text'
})

storeSchema.index({
  location: '2dsphere'
})

storeSchema.pre('save', async function(next) {
  if(!this.isModified('name')) {
    next() // skip it
    return; // stop function
  }

  this.slug = slug(this.name);
  
  // find other stores with the same slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx});

  // if slug is coing to be taken
  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }
  next();
})

storeSchema.statics.getTagsList = function() {
  // pipeline here
  return this.aggregate([
    { $unwind: '$tags' }, // field on document
    { $group: { _id: '$tags', count: { $sum: 1 } }}, // group everything by tag field
    { $sort: { count: -1 }}
  ]);
}

storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    //Lookup stores and populate reviews
    { $lookup: {from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' }},
    // filter for only items 2 or more
    { $match: {'reviews.1': {$exists: true }}},
    // add the average review
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      averageRating: { $avg: '$reviews.rating'}
    }},
    // sort it new field
    { $sort: { averageRating: -1 }},
    // limit to 10 most
    { $limit: 10}
  ]);
}

// find reviews where stores _id === reviews store property
// go to another model and query
storeSchema.virtual('reviews', {
  ref: 'Review', // what model to link
  localField: '_id', // which field on store
  foreignField: 'store' // which field on review
})

function autopopulate(next) {
  this.populate('reviews');
  next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);