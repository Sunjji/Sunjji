"use client";

import Page from "../_components/Page/Page";
import AllPets from "../my-page/_components/AllPets";

function MyPetsPage() {
  return (
    <Page title="나의 반려동물들">
      <div className=""></div>

      <div className="bg-whitePoint p-10 rounded-2xl">
        <AllPets />
      </div>
    </Page>
  );
}

export default MyPetsPage;
