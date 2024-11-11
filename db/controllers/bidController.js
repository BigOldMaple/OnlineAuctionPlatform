import db from "../db/db.js";

export const createBid = async (req, res) => {
  try {
    console.log('Received bid request with body:', {
      ...req.body,
      bid_amount: parseFloat(req.body.bid_amount).toFixed(2)
    });

    const { auction_id, user_id, bid_amount } = req.body;

    // Validate input
    if (!auction_id || !user_id || !bid_amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['auction_id', 'user_id', 'bid_amount'],
        received: req.body
      });
    }

    // First verify the auction exists and is active
    const auction = await db('auctions')
      .where({ id: auction_id })
      .first();
    
    console.log('Found auction:', auction);

    if (!auction) {
      return res.status(404).json({
        error: 'Auction not found',
        message: `Auction with ID ${auction_id} does not exist`
      });
    }

    // Verify the user exists
    const user = await db('users')
      .where({ id: user_id })
      .first();
    
    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${user_id} does not exist`
      });
    }

    // Start a transaction
    const trx = await db.transaction();

    try {
      // Insert the bid
      const [newBid] = await trx('bids')
        .insert({
          auction_id: auction_id,
          user_id: user_id,
          bid_amount: bid_amount,
          created_at: trx.fn.now()
        })
        .returning('*');

      console.log('Created new bid:', newBid);

      // Update the auction's current bid and highest bidder
      await trx('auctions')
        .where({ id: auction_id })
        .update({
          current_bid: bid_amount,
          highest_bid_user: user_id,
          updated_at: trx.fn.now()
        });

      // Commit the transaction
      await trx.commit();

      // Fetch the complete bid information with related data
      const bidWithDetails = await db('bids')
        .join('users', 'bids.user_id', 'users.id')
        .join('auctions', 'bids.auction_id', 'auctions.id')
        .select(
          'bids.*',
          'users.firstname',
          'users.lastname',
          'auctions.current_bid as auction_current_bid'
        )
        .where('bids.id', newBid.id)
        .first();

      return res.status(201).json({
        success: true,
        data: bidWithDetails,
        message: 'Bid placed successfully'
      });

    } catch (trxError) {
      await trx.rollback();
      console.error('Transaction error:', trxError);
      throw trxError;
    }

  } catch (error) {
    console.error('Bid creation error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    return res.status(500).json({
      error: 'Failed to place bid',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};