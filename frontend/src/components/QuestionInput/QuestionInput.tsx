// import { useContext, useState } from 'react'
// import { FontIcon, Stack, TextField } from '@fluentui/react'
// import { SendRegular } from '@fluentui/react-icons'

// import Send from '../../assets/Send.svg'

// import styles from './QuestionInput.module.css'
// import { ChatMessage } from '../../api'
// import { AppStateContext } from '../../state/AppProvider'
// import { resizeImage } from '../../utils/resizeImage'

// interface Props {
//   onSend: (question: ChatMessage['content'], id?: string) => void
//   disabled: boolean
//   placeholder?: string
//   clearOnSend?: boolean
//   conversationId?: string
// }

// export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
//   const [question, setQuestion] = useState<string>('')
//   const [base64Image, setBase64Image] = useState<string | null>(null);

//   const appStateContext = useContext(AppStateContext)
//   const OYD_ENABLED = appStateContext?.state.frontendSettings?.oyd_enabled || false;

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (file) {
//       await convertToBase64(file);
//     }
//   };

//   const convertToBase64 = async (file: Blob) => {
//     try {
//       const resizedBase64 = await resizeImage(file, 800, 800);
//       setBase64Image(resizedBase64);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const sendQuestion = () => {
//     if (disabled || !question.trim()) {
//       return
//     }

//     const questionTest: ChatMessage["content"] = base64Image ? [{ type: "text", text: question }, { type: "image_url", image_url: { url: base64Image } }] : question.toString();

//     if (conversationId && questionTest !== undefined) {
//       onSend(questionTest, conversationId)
//       setBase64Image(null)
//     } else {
//       onSend(questionTest)
//       setBase64Image(null)
//     }

//     if (clearOnSend) {
//       setQuestion('')
//     }
//   }

//   const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
//     if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
//       ev.preventDefault()
//       sendQuestion()
//     }
//   }

//   const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
//     setQuestion(newValue || '')
//   }

//   const sendQuestionDisabled = disabled || !question.trim()

//   return (
//     <Stack horizontal className={styles.questionInputContainer}>
//       <TextField
//         className={styles.questionInputTextArea}
//         placeholder={placeholder}
//         multiline
//         resizable={false}
//         borderless
//         value={question}
//         onChange={onQuestionChange}
//         onKeyDown={onEnterPress}
//       />
//       {!OYD_ENABLED && (
//         <div className={styles.fileInputContainer}>
//           <input
//             type="file"
//             id="fileInput"
//             onChange={(event) => handleImageUpload(event)}
//             accept="image/*"
//             className={styles.fileInput}
//           />
//           <label htmlFor="fileInput" className={styles.fileLabel} aria-label='Upload Image'>
//             <FontIcon
//               className={styles.fileIcon}
//               iconName={'PhotoCollection'}
//               aria-label='Upload Image'
//             />
//           </label>
//         </div>)}
//       {base64Image && <img className={styles.uploadedImage} src={base64Image} alt="Uploaded Preview" />}
//       <div
//         className={styles.questionInputSendButtonContainer}
//         role="button"
//         tabIndex={0}
//         aria-label="Ask question button"
//         onClick={sendQuestion}
//         onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}>
//         {sendQuestionDisabled ? (
//           <SendRegular className={styles.questionInputSendButtonDisabled} />
//         ) : (
//           <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
//         )}
//       </div>
//       <div className={styles.questionInputBottomBorder} />
//     </Stack>
//   )
// }
import { useContext, useState } from 'react'
import { FontIcon, Stack, TextField, Dropdown, IDropdownOption } from '@fluentui/react'
import { SendRegular } from '@fluentui/react-icons'

import Send from '../../assets/Send.svg'

import styles from './QuestionInput.module.css'
import { ChatMessage } from '../../api'
import { AppStateContext } from '../../state/AppProvider'
import { resizeImage } from '../../utils/resizeImage'

interface Props {
  onSend: (question: ChatMessage['content'], id?: string, selectedIndex?: string) => void // Added selectedIndex
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
}

const dropdownOptions: IDropdownOption[] = [
    { key: 'index1', text: 'index1' },
    { key: 'index2', text: 'index2' },
    { key: 'index3', text: 'index3' },
];

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<string>(''); // No default value

  const appStateContext = useContext(AppStateContext)
  const OYD_ENABLED = appStateContext?.state.frontendSettings?.oyd_enabled || false;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      await convertToBase64(file);
    }
  };

  const convertToBase64 = async (file: Blob) => {
    try {
      const resizedBase64 = await resizeImage(file, 800, 800);
      setBase64Image(resizedBase64);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return
    }

    const questionTest: ChatMessage["content"] = base64Image ? [{ type: "text", text: question }, { type: "image_url", image_url: { url: base64Image } }] : question.toString();

    if (conversationId && questionTest !== undefined) {
      onSend(questionTest, conversationId, selectedIndex)
      setBase64Image(null)
    } else {
      onSend(questionTest, undefined, selectedIndex) //Pass selected index here
      setBase64Image(null)
    }

    if (clearOnSend) {
      setQuestion('')
    }
  }

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '')
  }

  const sendQuestionDisabled = disabled || !question.trim()

  const handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption) => {
        if (item) {
            setSelectedIndex(item.key as string);
        }
    };

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      />

      {/* Dropdown Menu */}
        <Dropdown
            placeholder="Select an index"
            options={dropdownOptions}
            onChange={handleDropdownChange}
            selectedKey={selectedIndex}
            className={styles.dropdownMenu} // Add a class for styling
            // style={{ width: '120px', position: 'absolute', bottom: '0', left: '0', marginBottom: '5px', marginLeft: '5px' }}
            style={{ width: 'auto', minWidth: '120px', position: 'absolute', bottom: '0', left: '0', marginBottom: '5px', marginLeft: '5px' }}
        />


      {!OYD_ENABLED && (
        <div className={styles.fileInputContainer}>
          <input
            type="file"
            id="fileInput"
            onChange={(event) => handleImageUpload(event)}
            accept="image/*"
            className={styles.fileInput}
          />
          <label htmlFor="fileInput" className={styles.fileLabel} aria-label='Upload Image'>
            <FontIcon
              className={styles.fileIcon}
              iconName={'PhotoCollection'}
              aria-label='Upload Image'
            />
          </label>
        </div>)}
      {base64Image && <img className={styles.uploadedImage} src={base64Image} alt="Uploaded Preview" />}
      <div
        className={styles.questionInputSendButtonContainer}
        role="button"
        tabIndex={0}
        aria-label="Ask question button"
        onClick={sendQuestion}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}>
        {sendQuestionDisabled ? (
          <SendRegular className={styles.questionInputSendButtonDisabled} />
        ) : (
          <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
        )}
      </div>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  )
}