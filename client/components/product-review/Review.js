import StarRating from "./StarRating";
export default function Review() {
  return (
    <>
      <div className="container">
        <div class="row justify-content-around">
          <div class="col-12 col-md-6">

              <StarRating />
     
          </div>
          <div class="col-12 col-md-6 fs-5 align-self-center text-center">留下評論</div>
        </div>
      </div>
    </>
  );
}
