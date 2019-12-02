import React, { Component } from 'react';

import Button from "@material-ui/core/Button/Button";

import './App.css';
import Header from './Header';
import Description from './Description';
import SourceLangPanel from './SourceLangPanel';
import TargetLangPanel from './TargetLangPanel';
import CommentFeedback from './CommentFeedback';
import QualityFeedback from './QualityFeedback';

// The mock data stored in local file system.
// This is used to develop ansd test new features without Turkle.
// You may change the filename here to use different configurations.
import mock from './mock.json';

// semantic version
const version = {
  MAJOR: 1,
  MINOR: 1,
  PATCH: 4
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      srcTokens: [],
      tarTokens: [],
      selections: [[]], // List<List<bool>>
      srcPos: 0,
      currentSelection: [],
      alignerhasFocus: true,
      // UI config.
      fontSize: 'small',

      // showing what is aligned to what.
      srcIsBlurry: [],
      tarIsBlurry: [],

      // for re-tokenization control.
      srcEnableRetokenize: true,
      tarEnableRetokenize: true,

      // for span hightlight and bolded head tokens.
      srcColors: [], // List<string>
      tarColors: [], // List<string>
      srcHeadInds: new Set(),
      tarHeadInds: new Set(),

      // annotaor training
      training: false,
      showFeedback: false,
      goldAlignment: null,

      // translation quality feedback
      collectTranslationQuality: false,
      translationQualityScale: 100,
      additionalData: null,
      collectComment: false,
    };
  }

  componentDidMount() {}

  componentWillMount() {
    // These input fields are required for Turkle to collect
    // annotation results. And we will hide it from the UI.
    var n = document.querySelector("#srcTokensInput");
    if (n) { n.style.display = 'none'; }
    n = document.querySelector("#tarTokensInput");
    if (n) { n.style.display = 'none'; }
    n = document.querySelector("#alignmentInput");
    if (n) { n.style.display = 'none'; }
    console.log("hide <input>s");

    var el = document.querySelector("#hiddenSubmit");
    if (el) {
      // if el is not null, than this code is loaded by Turkle.
      el.style.display = 'none';

      console.log(window.tar_tokens);
      console.log(window.src_tokens);
      console.log(window.config_obj)
      this.initializeStates(window.src_tokens, window.tar_tokens, window.config_obj);
    } else {
      // this code is executeed independently, not inside Turkle.
      const {src_tokens, tar_tokens, config_obj} = mock;
      this.initializeStates(src_tokens, tar_tokens, config_obj);
    }
  }

  initializeStates(src_tokens, tar_tokens, configObj) {
    // target language
    const tarIsBlurry = tar_tokens.map((token) => false);
    this.setState({tarTokens: tar_tokens, tarIsBlurry: tarIsBlurry});

    // source language
    const srcIsBlurry = src_tokens.map((token) => false);
    this.setState({srcTokens: src_tokens, srcIsBlurry: srcIsBlurry});

    // Deserialized JSON string of config_obj.
    // Configurations will have default values unless specified in `configObj`.

    // compare version number to ensure compatibility.
    if (!configObj.hasOwnProperty('version')) {
      var msg = '`configObj` has no key `version`. This CSV file is too old.'
      this.setState({srcTokens: msg.split(" "),
                     tarTokens: []});
      console.log(msg)
      configObj = {};
      return;
    } else if (version.MAJOR !== configObj.version.MAJOR) {
      msg = `Incompatible CSV file. React code major version (${version.MAJOR}) !== \`configObj\` major version (${configObj.version.MAJOR}).`
      this.setState({srcTokens: msg.split(" "),
                     tarTokens: []});
      console.log(msg)
      configObj = {};
      return;
    }

    // 1. initial alignemnt. (Default: every entry in `selections` is false)
    var selections = src_tokens.map((token) =>
      tar_tokens.map((token) => false)
    );
    if (configObj.hasOwnProperty('alignment')) {
      selections = configObj['alignment'];
    }
    this.setState({selections: selections,});

    // 2. re-tokenization control. (Default: true)
    if (configObj.hasOwnProperty('src_enable_retokenize'))
      this.setState({
        srcEnableRetokenize: configObj['src_enable_retokenize']
      });
    if (configObj.hasOwnProperty('tar_enable_retokenize'))
      this.setState({
        tarEnableRetokenize: configObj['tar_enable_retokenize']
      });

    // 3. hightlight/colored spans. (Default: no highlights)
    // need to make sure spans are sorted and not overlapped.
    let hueIncr = 67;
    let hue = hueIncr;

    // generate src span colors.
    let srcColors = [];
    // setting default values
    for (let j = 0; j < src_tokens.length; j++)
      srcColors.push('hsl(0,0%,87%)');
    if (configObj.hasOwnProperty('src_spans')) {
      let src_spans = configObj['src_spans'];
      for (let i = 0; i < src_spans.length; i++) {
        let begin = src_spans[i][0];
        let end = src_spans[i][1];
        for (let j = begin; j < end; j++)
          srcColors[j] = `hsl(${hue},50%,75%)`;
        hue = (hue + hueIncr) % 360;
      }
    }

    // generate tar span colors.
    let tarColors = [];
    // setting default values
    for (let j = 0; j < tar_tokens.length; j++)
      tarColors.push('hsl(0,0%,87%)');
    if (configObj.hasOwnProperty('tar_spans')) {
      var tar_spans = configObj['tar_spans'];
      for (let i = 0; i < tar_spans.length; i++) {
        let begin = tar_spans[i][0];
        let end = tar_spans[i][1];
        for (let j = begin; j < end; j++)
          tarColors[j] = `hsl(${hue},50%,75%)`;
        hue = (hue + hueIncr) % 360;
      }
    }
    this.setState({srcColors: srcColors, tarColors: tarColors});

    // 4. bolded head inds. (Default: no bolded text.)
    if (configObj.hasOwnProperty('src_head_inds')){
      // move `srcPos` to the first head idx.
      var srcPos = 0;
      const headInds = new Set(configObj['src_head_inds']);
      while (headInds.size > 0 && !headInds.has(srcPos))
        srcPos += 1;
      this.setState({
        srcPos: srcPos,
        srcHeadInds: headInds,
      });
    }

    if (configObj.hasOwnProperty('tar_head_inds'))
      this.setState({
        tarHeadInds: new Set(configObj['tar_head_inds'])
      });

    // 5. token font size. (Default: small.)
    if (configObj.hasOwnProperty('font_size'))
      this.setState({
        fontSize: configObj['font_size']
      });

    // 6. annotator training. (Default: no training.)
    if (configObj.hasOwnProperty('gold_alignment')) {
      this.setState({
        training: true,
        goldAlignment: configObj['gold_alignment']
      });
    }

    // this flag indicates if we will collect any additional feedback data.
    // if so, we'll create a new <input> element for Turkle to collect data.
    var createAdditionalDataInput = false;

    // 7. translation quality. (Default: no feedback.)
    if (configObj.hasOwnProperty('translation_quality_scale')) {
      // create a new input element after #alignmentInput.
      console.log("configObj has translation_quality_scale");
      this.setState({
        collectTranslationQuality: true,
        translationQualityScale: configObj['translation_quality_scale']
      });
      createAdditionalDataInput = true;
    }

    // 8. collect comment. (Default: no feedback.)
    if (configObj.hasOwnProperty('collect_comment')) {
      // create a new input element after #alignmentInput.
      console.log("configObj has collect_comment");
      if (configObj['collect_comment']) {
        this.setState({
          collectComment: true,
        });
        createAdditionalDataInput = true;
      }
    }

    // 9. source text direction. (Default: auto)
    var sourceTextDirection = 'auto';
    if (configObj.hasOwnProperty('src_text_dir')) {
      sourceTextDirection = configObj['src_text_dir'];
    }
    this.setState({sourceTextDirection: sourceTextDirection});

    // 10. target text direction.  (Default: auto)
    var targetTextDirection = 'auto';
    if (configObj.hasOwnProperty('tar_text_dir')) {
      targetTextDirection = configObj['tar_text_dir'];
    }
    this.setState({targetTextDirection: targetTextDirection});

    // 11. description.  (Default: null)
    var description = null;
    if (configObj.hasOwnProperty('description')) {
      description = configObj['description'];
    }
    this.setState({description: description});

    // N. new feature. (Default: <default>.)

    if (createAdditionalDataInput) {
      // if this.state.additionalData won't be null,
      // then we have to create a new input field
      // so Turkle could collect the results.
      console.log("create new <input> element for additionalData.")
      var input = document.createElement("INPUT");
      input.setAttribute("id", "additionalDataInput");
      input.setAttribute("name", "additionalData");
      input.setAttribute("type", "text");
      const node = document.querySelector("#alignmentInput");
      if (node) {
        node.parentNode.insertBefore(input, node.nextSibling);
        input.style.display = 'none';
      }
    }
  }

  // class methods as event listeners

  handleSrcPosChange = (newPos) => {
    if (0 <= newPos && newPos < this.state.srcTokens.length){
      this.setState({
        srcPos: newPos,
      })
    }
  }

  handleToggleSelectionAt = (idx) => {
    let selections = this.state.selections;
    let selection = selections[this.state.srcPos];

    selection[idx] = (selection[idx] !== true);
    selections[this.state.srcPos] = selection;

    this.setState({
      selections: selections,
    })
  }

  handleChangeSrcTokens = (newTokens) => {
    // update app states
    var selections = newTokens.map((token) =>
      this.state.tarTokens.map((token) => false)
    );
    this.setState({
      srcTokens: newTokens,
      selections: selections
    })
  }

  handleChangeTarTokens = (newTokens) => {
    var selections = this.state.srcTokens.map((token) =>
      newTokens.map((token) => false)
    );
    this.setState({
      tarTokens: newTokens,
      selections: selections
    })
  }

  handlePrevData = () => {
    // first save current data to backend, then query new data.
    let dataIdx = this.state.dataIdx;
    if (dataIdx > 1) {
      this.setState({dataIdx: dataIdx-1});
      this.fetchCommunicationAndUpdateState(dataIdx-1)
    }
  }

  handleNextData = () => {
    let dataIdx = this.state.dataIdx;
    if (dataIdx < this.state.totalData) {
      this.setState({dataIdx: dataIdx+1});
      this.fetchCommunicationAndUpdateState(dataIdx+1)
    }
  }

  handleSubmit = () => {
    console.log("handling submission");
    console.log(this.state.additionalData);

    var n = document.querySelector("#srcTokensInput");
    if (n) {
      n.value = JSON.stringify(this.state.src_tokens);
    }
    n = document.querySelector("#tarTokensInput");
    if (n) {
      n.value = JSON.stringify(this.state.tar_tokens);
    }
    n = document.querySelector("#alignmentInput");
    if (n) {
      n.value = JSON.stringify(this.state.selections);
    }
    n = document.querySelector("#additionalDataInput");
    if (n) {
      n.value = JSON.stringify(this.state.additionalData);
    }
  }

  handleFontSizeChange = (sizeStr) => {
    this.setState({fontSize: sizeStr});
    console.log(sizeStr);
  }

  handleSrcHoverIdxChange = (idx) => {
    //this.setState({srcHoverIdx: idx});
    console.log(`hover on src ${idx}`);

    if (idx == null) {
      // reset blurriness.
      const srcIsBlurry = this.state.srcTokens.map((token) => false);
      const tarIsBlurry = this.state.tarTokens.map((token) => false);
      this.setState({srcIsBlurry: srcIsBlurry, tarIsBlurry: tarIsBlurry});
      return;
    }

    const touched = this.state.selections[idx].some((b) => b === true)
    // if not touched, don't trigger blurriness.
    if (!touched)
      return;

    // update `srcIsBlurry` & `tarIsBlurry`.
    var srcIsBlurry = this.state.srcIsBlurry;
    for (var i = 0; i < srcIsBlurry.length; i++)
      if (i !== idx)
        srcIsBlurry[i] = true;

    var tarIsBlurry = this.state.tarIsBlurry;
    for (i = 0; i < tarIsBlurry.length; i++)
      if (!this.state.selections[idx][i])
        tarIsBlurry[i] = true;

    this.setState({srcIsBlurry: srcIsBlurry, tarIsBlurry: tarIsBlurry});
    //console.log("set blurriness", srcIsBlurry, tarIsBlurry);
  }

  handleTarHoverIdxChange = (idx) => {
    console.log(`hover on tar ${idx}`);

    if (idx == null) {
      // reset blurriness.
      const srcIsBlurry = this.state.srcTokens.map((token) => false);
      const tarIsBlurry = this.state.tarTokens.map((token) => false);
      this.setState({srcIsBlurry: srcIsBlurry, tarIsBlurry: tarIsBlurry});
      return;
    }

    var touched = false;
    for (var i = 0; i < this.state.selections.length; i++)
      if (this.state.selections[i][idx]){
        touched = true;
        break;
      }
    // if not touched, don't trigger blurriness.
    if (!touched)
      return;

    // update `srcIsBlurry` & `tarIsBlurry`.
    var tarIsBlurry = this.state.tarIsBlurry;
    for (i = 0; i < tarIsBlurry.length; i++)
      if (i !== idx)
        tarIsBlurry[i] = true;

    var srcIsBlurry = this.state.srcIsBlurry;
    for (i = 0; i < srcIsBlurry.length; i++)
      if (!this.state.selections[i][idx])
        srcIsBlurry[i] = true;

    this.setState({srcIsBlurry: srcIsBlurry, tarIsBlurry: tarIsBlurry});
    console.log("set blurriness", srcIsBlurry, tarIsBlurry);
  }

  showTrainingFeedack = () => {
    this.setState({showFeedback: true});
  };

  modifyAdditionalData = (key, value) => {
    let d = this.state.additionalData;
    if (d === null)
      d = {};
    d[key] = value;
    this.setState({additionalData: d});
    console.log(`${key} is set to ${value}`);
  };

  render() {
    const srcConfig = {
      colors: this.state.srcColors,
      enableRetokenize: this.state.srcEnableRetokenize,
      headInds: this.state.srcHeadInds,
      fontSize:this.state.fontSize,
      sourceTextDirection: this.state.sourceTextDirection,
    };
    const tarConfig = {
      colors: this.state.tarColors,
      enableRetokenize: this.state.tarEnableRetokenize,
      headInds: this.state.tarHeadInds,
      fontSize:this.state.fontSize,
      targetTextDirection: this.state.targetTextDirection,
    };

    const {
      training, showFeedback,
      collectTranslationQuality,
      translationQualityScale,
      collectComment,
    } = this.state;

    var trainingBtn = null;
    if (training) {
      if (showFeedback) {
        trainingBtn = <Button
          variant="contained" disabled
          onClick={null}>
          Check Gold Alignment</Button>;
      } else {
        trainingBtn = <Button
          variant="contained" color="secondary"
          onClick={this.showTrainingFeedack}>
          Check Gold Alignment</Button>;
      }
    }

    var qualityFeedback = null;
    if (collectTranslationQuality){
      qualityFeedback = <QualityFeedback
        qualityScale={translationQualityScale}
        modifyAdditionalData={this.modifyAdditionalData}
      />;
    }

    var commentFeedback = null;
    if (collectComment){
      commentFeedback = <CommentFeedback
        onFocusIn={() => this.setState({alignerhasFocus: false})}
        onFocusOut={() => this.setState({alignerhasFocus: true})}
        modifyAdditionalData={this.modifyAdditionalData}
      />;
    }

    return (
      <div>
        <Header
          trainingBtn={trainingBtn}
          handleFontSizeChange={this.handleFontSizeChange}/>
        <Description text={this.state.description} />
        <SourceLangPanel
          tokens={this.state.srcTokens} currentPos={this.state.srcPos}
          selections={this.state.selections}
          isBlurry={this.state.srcIsBlurry}
          config={srcConfig}
          goldAlignment={this.state.goldAlignment}
          showFeedback={this.state.showFeedback}
          headInds={this.state.srcHeadInds}
          colors={this.state.srcColors}
          enableRetokenize={this.state.srcEnableRetokenize}
          fontSize={this.state.fontSize}
          moveSrcPos={this.handleSrcPosChange}
          changeTokens={this.handleChangeSrcTokens}
          setHoverIdx={this.handleSrcHoverIdxChange}
          hasFocus={this.state.alignerhasFocus}
        />
        <TargetLangPanel
          tokens={this.state.tarTokens} currentPos={this.state.srcPos}
          selections={this.state.selections}
          isBlurry={this.state.tarIsBlurry}
          config={tarConfig}
          goldAlignment={this.state.goldAlignment}
          showFeedback={this.state.showFeedback}
          headInds={this.state.tarHeadInds}
          colors={this.state.tarColors}
          enableRetokenize={this.state.tarEnableRetokenize}
          fontSize={this.state.fontSize}
          toggleSelectionAt={this.handleToggleSelectionAt}
          changeTokens={this.handleChangeTarTokens}
          setHoverIdx={this.handleTarHoverIdxChange} />

        {/* feedback UI */}
        {qualityFeedback}
        {commentFeedback}

        <input className="submit" onClick={this.handleSubmit}
               type="submit" value="Submit" />
      </div>
    );
  }
}

export default App;
