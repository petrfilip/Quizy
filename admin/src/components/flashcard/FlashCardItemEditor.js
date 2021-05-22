import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import MDEditor, { commands } from '@uiw/react-md-editor';
import Button from "@material-ui/core/Button";
import { selectWord } from "@uiw/react-md-editor/lib/esm/utils/markdownUtils";
import UploadImageArea from "../file-manager/UploadImageArea";
import FolderIcon from "@material-ui/icons/Folder";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FileManager from "../file-manager/FileManager";
import { useTranslation } from "react-i18next";

export default function FlashCardItemEditor({ flashcard }) {
  const { t } = useTranslation();

  const [componentData, setComponentData] = useState(flashcard)
  const [open, setOpen] = React.useState(false);
  const [fileModalProps, setFileModalProps] = React.useState();

  const handleClickOpen = (state, api) => {
    setFileModalProps({ state, api })
    setOpen(true);
  };

  const handleClose = () => {
    setFileModalProps(null)
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    flashcard[name] = value
    const newData = { ...flashcard };
    setComponentData(newData)
  }

  const image = {
    name: 'image',
    keyCommand: 'image',
    shortcuts: 'ctrlcmd+i',
    buttonProps: { title: 'Add image' },
    icon: (<>FM</>),
    execute: (state, api) => {
      handleClickOpen(state, api);

    },
  };

  return <div>
    <FileDialog/>
    <TextField
      fullWidth
      placeholder={t('title_flashcardsTitle')}
      type={"text"}
      name={"title"}
      value={componentData.title}
      onChange={handleInputChange}
    />
    {/*<textarea name={"description"} value={componentData.description} onChange={handleInputChange}/>*/}

    <MDEditor
      height={400}
      value={componentData.description}
      onChange={(src) => {
        handleInputChange({
            target: {
              value: src,
              name: "description"
            }
          }
        )
      }
      }

      commands={[
        commands.bold,
        commands.italic,
        commands.strikethrough,
        commands.hr,
        commands.title,
        commands.divider,
        commands.link,
        commands.quote,
        commands.code,
        commands.codeBlock,
        commands.image,
        commands.divider,
        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.checkedListCommand,
        commands.divider,
        commands.codeEdit,
        commands.codeLive,
        commands.codePreview,
        commands.divider,
        commands.fullscreen,
        image
      ]}

    />
    {/*<MDEditor.Markdown source={componentData.description}/>*/}
    <FileDialog isOpen={open} handleClose={handleClose} fileModalProps={fileModalProps}/>
  </div>
}

const FileDialog = ({ isOpen = false, handleClose, fileModalProps }) => {

  const [showUploadForm, setShowUploadForm] = useState(true);

  const addFile = (file) => {
    const { state, api } = fileModalProps;
    // Select everything
    const newSelectionRange = selectWord({ text: state.text, selection: state.selection });
    const state1 = api.setSelectionRange(newSelectionRange);
    // Replaces the current selection with the image
    const imageTemplate = process.env.REACT_APP_BASE_URI + "" +file.publicPath;
    api.replaceSelection(`![](${imageTemplate})`);
    // Adjust the selection to not contain the **
    api.setSelectionRange({
      start: 4 + state1.selection.start,
      end: 4 + state1.selection.start + imageTemplate.length,
    });

    handleClose()
  }



  return (
    <Dialog maxWidth={"xl"} fullWidth={true} open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Upload file</DialogTitle>
      <DialogContent>
        {showUploadForm ?
          <UploadImageArea location={"/"} onSaveCallback={addFile}/> :
          <FileManager onFileClick={addFile} />
        }
      </DialogContent>
      <DialogActions>
        {showUploadForm ? <Button
          startIcon={<FolderIcon/>}
          onClick={(e) => {
            setShowUploadForm(false)
          }} color="primary">
          Use existing
        </Button> :
          <Button
          startIcon={<CloudUploadIcon />}
          onClick={(e) => {
            setShowUploadForm(true)
        }} color="primary">
          Upload new
          </Button>}
        <Button onClick={(e) => {
          handleClose()
        }} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

