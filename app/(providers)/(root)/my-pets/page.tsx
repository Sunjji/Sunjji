import Button from "@/components/Button/Button";
import Page from "../_components/Page/Page";

function MyPetsPage() {
  return (
    <Page title="나의 반려동물들">
      <div className="absolute top-20 right-[84px]">
        <Button>반려동물 등록하기</Button>
      </div>

      <div className="bg-whitePoint p-10 rounded-2xl">blabla</div>
    </Page>
  );
}

export default MyPetsPage;
