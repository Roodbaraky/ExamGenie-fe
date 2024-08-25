import { Document, Image, Page, StyleSheet } from "@react-pdf/renderer";
import { Question } from "./QuestionsForm";

const stylesOneQuestionSlide = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "auto",
    padding: 10,
  },
});

const stylesFourQuestionSlide = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    backgroundColor: "#E4E4E4",
  },
  img: {
    width: "50%",
    height: "auto",
    aspectRatio: 16 / 9,
    padding: 10,
  },
});

const stylesFullPageAssessment = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  img: {
    width: "90%",
    height: "auto",
    marginHorizontal: "auto",
    padding: 10,
  },
});

const stylesHalfPageAssessment = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    justifyContent: "flex-start",
  },
  
  img: {
    width: "50%",
    height: "auto",
    marginVertical: 10,
    marginLeft: 10,
  },
  rightSection: {
    width: "50%",
    padding: 10,
    backgroundColor: "#ffffff",
  },
});

interface PDFFileProps {
  questionURLs: Question[];
  format: string;
}

export default function PDFFile({ questionURLs, format }: PDFFileProps) {
  console.log(format);
  const getStyles = () => {
    switch (format) {
      case "1QSTR":
        return stylesOneQuestionSlide;
      case "4QSTR":
        return stylesFourQuestionSlide;
      case "FPA":
        return stylesFullPageAssessment;
      case "HPA":
        return stylesHalfPageAssessment;
      default:
        return stylesOneQuestionSlide;
    }
  };

  const styles = getStyles();
  return (
    <Document>
      <Page
        size={"A4"}
        style={styles.page}
        orientation={format.includes("QSTR") ? "landscape" : "portrait"}
      >
        {questionURLs.map((questionObject: Question, index: number) => (
          <Image key={index} src={questionObject?.URL??'https://1080motion.com/wp-content/uploads/2018/06/NoImageFound.jpg.png'} style={styles.img}/>
        ))}
      </Page>
    </Document>
  );
}
