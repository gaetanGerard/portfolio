import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const WysiwygEditor = ({handleEditorStateChange, editorState, onBlur}) => {

    const iconPaths = {
        bold: `/images/editor/bold.svg`,
        italic: `/images/editor/italic.svg`,
        underline: `/images/editor/underline.svg`,
        strikethrough: `/images/editor/strikethrough.svg`,
        superscript: `/images/editor/superscript.svg`,
        subscript: `/images/editor/subscript.svg`,
        fontSize: `/images/editor/fontSize.svg`,
        unordered: `/images/editor/unordered.svg`,
        ordered: `/images/editor/ordered.svg`,
        indent: `/images/editor/indent.svg`,
        outdent: `/images/editor/outdent.svg`,
        left: `/images/editor/left.svg`,
        center: `/images/editor/center.svg`,
        right: `/images/editor/right.svg`,
        justify: `/images/editor/justify.svg`,
        color: `/images/editor/color.svg`,
        link: `/images/editor/link.svg`,
        unlink: `/images/editor/unlink.svg`,
        undo: `/images/editor/undo.svg`,
        redo: `/images/editor/redo.svg`
    }

    const toolbarOptions = {
        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'history'],
        inline: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
          bold: { icon: iconPaths.bold, className: "fill-black" },
          italic: { icon: iconPaths.italic, className: "fill-black" },
          underline: { icon: iconPaths.underline, className: "fill-black" },
          strikethrough: { icon: iconPaths.strikethrough, className: "fill-black" },
          superscript: { icon: iconPaths.superscript, className: "fill-black" },
          subscript: { icon: iconPaths.subscript, className: "fill-black" },
        },
        blockType: {
          inDropdown: true,
          options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
        },
        fontSize: {
          icon: iconPaths.fontSize,
          options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
        },
        fontFamily: {
          options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
        },
        list: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ['unordered', 'ordered', 'indent', 'outdent'],
          unordered: { icon: iconPaths.unordered, className: "fill-black" },
          ordered: { icon: iconPaths.ordered, className: "fill-black" },
          indent: { icon: iconPaths.indent, className: "fill-black" },
          outdent: { icon: iconPaths.outdent, className: "fill-black" },
        },
        textAlign: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ['left', 'center', 'right', 'justify'],
          left: { icon: iconPaths.left, className: "fill-black" },
          center: { icon: iconPaths.center, className: "fill-black" },
          right: { icon: iconPaths.right, className: "fill-black" },
          justify: { icon: iconPaths.justify, className: "fill-black" },
        },
        colorPicker: {
          icon: iconPaths.color,
          className: undefined,
          component: undefined,
          popupClassName: undefined,
          colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
            'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
            'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
            'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
            'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
            'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
        },
        link: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          popupClassName: undefined,
          dropdownClassName: undefined,
          showOpenOptionOnHover: true,
          defaultTargetOption: '_self',
          options: ['link', 'unlink'],
          link: { icon: iconPaths.link, className: "fill-black" },
          unlink: { icon: iconPaths.unlink, className: "fill-black" },
          linkCallback: undefined
        },
        history: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ['undo', 'redo'],
          undo: { icon: iconPaths.undo, className: "fill-black" },
          redo: { icon: iconPaths.redo, className: "fill-black" },
        },
    };

    const myBlockStyleFn = (contentBlock) => {
        const type = contentBlock.getType();
        if (type === 'header-one') {
          return 'test-header-one-class';
        }
      }

  return (
    <>
        <Editor
            toolbarClassName="editor-toolbar"
            wrapperClassName="editor-wrapper"
            editorClassName="editor"
            onEditorStateChange={handleEditorStateChange}
            toolbar={toolbarOptions}
            blockStyleFn={myBlockStyleFn}
            editorState={editorState}
            onBlur={onBlur}
        />
    </>
  )
}

export default WysiwygEditor