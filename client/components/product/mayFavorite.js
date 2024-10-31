import React, { useState } from "react";
import MayFavoriteProductCard from "./mayFavoriteProductCard"; // 確保路徑正確

const MayFavorite = () => {
    return (
        <>
            <div className="col-12">
                <h2 className="mb-4 text-center">你可能也喜歡</h2>
                <div className="row">
                    <MayFavoriteProductCard />
                    <MayFavoriteProductCard />
                    <MayFavoriteProductCard />
                    <MayFavoriteProductCard />
                </div>
            </div>
        </>
    );
};

export default MayFavorite;
