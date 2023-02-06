import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import IFile from "../../../../libs/types";

const index: NextPage<{ file: IFile }> = ({ file }: any) => {
  return (
    <div className="w-full text-xl">
      <h1>{file.name}</h1>
    </div>
  );
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  let file;
  try {
    const { data } = await axios.get(`http://locahost:8000/api/files/${id}`);
    file = data;
  } catch (error) {
    console.log(error.response.data);
    file = {};
  }

  return {
    props: {
      file,
    }, // will be passed to the page component as props
  };
}
