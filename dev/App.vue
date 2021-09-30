<template>
  <v-app>
    <v-navigation-drawer
      app
      clipped
      :clipped-left="!$vuetify.rtl"
      :clipped-right="$vuetify.rtl"
      :right="$vuetify.rtl"
    >
      <v-list-item>
        <v-list-item-icon>
          <vuetify-logo
            width="64"
            height="64"
            :iconColor="
              this.$vuetify.theme.dark
                ? `${this.$vuetify.theme.themes.dark.primary}`
                : `${this.$vuetify.theme.themes.light.primary}`
            "
          />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Examples </v-list-item-title>
          <v-list-item-subtitle> Vuetify Renderers </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="(example, index) in examples"
          :key="example.title"
          link
        >
          <v-list-item-content @click="selectExample(index)">
            <v-list-item-title>{{ example.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-toolbar-title>
        <v-container fill-height fluid
          ><v-row align="center" justify="center">
            <v-col>
              <json-forms-logo
                width="64"
                height="64"
                :iconColor="
                  this.$vuetify.theme.dark
                    ? `${this.$vuetify.theme.themes.dark.primary}`
                    : `${this.$vuetify.theme.themes.light.primary}`
                "
              />
            </v-col>
            <v-col>JSON Forms </v-col>
          </v-row></v-container
        ></v-toolbar-title
      >

      <v-spacer expand></v-spacer>

      <v-toolbar-items>
        <v-container fill-height fluid justify-end
          ><v-row dense>
            <v-col
              ><settings
                :validationMode="validationMode"
                :hideRequiredAsterisk="config.hideRequiredAsterisk"
                :showUnfocusedDescription="config.showUnfocusedDescription"
                :restrict="config.restrict"
                :readonly="readonly"
                @validation-changed="
                  (validation) => (this.validationMode = validation)
                "
                @hide-required-asterisk-changed="
                  (value) => (this.config.hideRequiredAsterisk = value)
                "
                @show-unfocused-description-changed="
                  (value) => (this.config.showUnfocusedDescription = value)
                "
                @readonly-changed="(value) => (this.readonly = value)"
                @restrict-changed="(value) => (this.config.restrict = value)"
              />
            </v-col>
            <v-col><theme-changer /> </v-col>
          </v-row>
        </v-container>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="demo" v-if="selectedExample.value">
        <v-flex>
          <v-card>
            <v-card-title>{{ selectedExample.value.title }}</v-card-title>
            <v-card-text>
              <v-tabs v-model="activeTab">
                <v-tab :key="0">Demo</v-tab>
                <v-spacer expand />
                <v-tab :key="1">Schema</v-tab>
                <v-tab :key="2">UI Schema</v-tab>
                <v-tab :key="3">Data</v-tab>

                <v-tab-item :key="0">
                  <demo-form
                    :example="selectedExample.value"
                    :renderers="renderers"
                    :cells="cells"
                    :config="config"
                    :validationMode="validationMode"
                    :ajv="handleDefaultsAjv"
                    :readonly="readonly"
                    @change="onChange"
                  />
                </v-tab-item>
                <v-tab-item :key="1">
                  <v-card>
                    <v-card-title>
                      <v-toolbar flat>
                        <v-toolbar-title>Schema</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="reloadMonacoSchema">
                          <v-icon>mdi-reload</v-icon>
                        </v-btn>
                        <v-btn icon @click="saveMonacoSchema">
                          <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                      </v-toolbar>
                    </v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      v-if="monacoSchemaModel.value"
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      :language="`json`"
                      v-model="monacoSchemaModel.value"
                      :editorBeforeMount="registerValidatons"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="2">
                  <v-card>
                    <v-card-title>
                      <v-toolbar flat>
                        <v-toolbar-title>UI Schema</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="reloadMonacoUiSchema">
                          <v-icon>mdi-reload</v-icon>
                        </v-btn>
                        <v-btn icon @click="saveMonacoUiSchema">
                          <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                      </v-toolbar>
                    </v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      v-if="monacoUiSchemaModel.value"
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      language="json"
                      v-model="monacoUiSchemaModel.value"
                      :editorBeforeMount="registerValidatons"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="3">
                  <v-card>
                    <v-card-title>
                      <v-toolbar flat>
                        <v-toolbar-title>Data</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="reloadMonacoData">
                          <v-icon>mdi-reload</v-icon>
                        </v-btn>
                        <v-btn icon @click="saveMonacoData">
                          <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                      </v-toolbar>
                    </v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      v-if="monacoDataModel.value"
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      language="json"
                      v-model="monacoDataModel.value"
                      :editorBeforeMount="registerValidatons"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import {
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import { JsonFormsChangeEvent } from '@jsonforms/vue2';
import {
  createAjv,
  extendedVuetifyRenderers,
  mergeStyles,
  defaultStyles,
} from '../src';
import ajvErrorsPlugin from 'ajv-errors';

import { examples } from './components/examples';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import {
  configureJsonSchemaValidation,
  configureUISchemaValidation,
  configureDataValidation,
  EditorApi,
  getMonacoModelForUri,
} from './core/jsonSchemaValidation';

import ThemeChanger from './components/ThemeChanger.vue';
import Settings from './components/Settings.vue';
import DemoForm from './components/DemoForm.vue';
import MonacoEditor from './components/MonacoEditor.vue';
import JsonFormsLogo from './components/JsonFormsLogo.vue';
import VuetifyLogo from './components/VuetifyLogo.vue';
import { Example } from './core/types';

const ajv = createAjv({ useDefaults: true });
ajvErrorsPlugin(ajv);

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' },
});

const renderers = Object.freeze(
  extendedVuetifyRenderers
) as JsonFormsRendererRegistryEntry[];

export default defineComponent({
  name: 'app',
  components: {
    DemoForm,
    MonacoEditor,
    ThemeChanger,
    Settings,
    JsonFormsLogo,
    VuetifyLogo,
  },
  data() {
    const monacoSchemaModel = ref<monaco.editor.ITextModel | undefined>(
      undefined
    );
    const monacoUiSchemaModel = ref<monaco.editor.ITextModel | undefined>(
      undefined
    );
    const monacoDataModel = ref<monaco.editor.ITextModel | undefined>(
      undefined
    );

    const selectedExample = ref<Example | undefined>(undefined);

    return {
      readonly: false,
      validationMode: 'ValidateAndShow',
      activeTab: 0,
      renderers: renderers,
      cells: renderers,
      config: {
        restrict: true,
        trim: false,
        showUnfocusedDescription: false,
        hideRequiredAsterisk: true,
      },
      handleDefaultsAjv: ajv,
      selectedExample,
      data: {},
      monacoSchemaModel,
      monacoUiSchemaModel,
      monacoDataModel,
      examples,
    };
  },
  methods: {
    onValidationChange(validation: string) {
      this.validationMode = validation;
    },
    onChange(event: JsonFormsChangeEvent) {
      console.log('JsonForm data change');

      this.data = event.data;
      const example = this.selectedExample.value;
      if (example) {
        this.monacoDataModel.value = getMonacoModelForUri(
          monaco.Uri.parse(this.toDataUri(example.id)),
          this.data ? JSON.stringify(this.data, null, 2) : ''
        );
      }
    },
    selectExample(index: number) {
      const input = this.examples[index];
      if (input) {
        // recreate the example when we switch examples, any modified schema,uischema,data will be lost
        const example = {
          id: `${index}`,
          title: input.title,
          schema: input.input.schema,
          uischema: input.input.uischema,
          data: input.input.data,
        };

        this.selectedExample.value = example;

        this.monacoSchemaModel.value = getMonacoModelForUri(
          monaco.Uri.parse(this.toSchemaUri(example.id)),
          example && example.schema
            ? JSON.stringify(example.schema, null, 2)
            : ''
        );

        this.monacoUiSchemaModel.value = getMonacoModelForUri(
          monaco.Uri.parse(this.toUiSchemaUri(example.id)),
          example && example.uischema
            ? JSON.stringify(example.uischema, null, 2)
            : ''
        );

        this.monacoDataModel.value = getMonacoModelForUri(
          monaco.Uri.parse(this.toDataUri(example.id)),
          example && example.data ? JSON.stringify(example.data, null, 2) : ''
        );
      } else {
        this.selectedExample.value = undefined;
        this.monacoSchemaModel.value = undefined;
        this.monacoUiSchemaModel.value = undefined;
        this.monacoDataModel.value = undefined;
      }
    },
    reloadMonacoSchema() {
      const example = this.selectedExample.value;
      if (example) {
        this.monacoSchemaModel.value?.setValue(
          example.schema ? JSON.stringify(example.schema, null, 2) : ''
        );
      }
    },
    saveMonacoSchema() {
      const model = this.monacoSchemaModel.value;
      const example = this.selectedExample.value;

      if (model && example) {
        const modelValue = model.getValue();
        if (modelValue) {
          let newJson: Record<string, any> | undefined = undefined;

          try {
            newJson = JSON.parse(modelValue);
          } catch (error) {
            console.error('Invalid Schema JSON: ' + error);
          }

          if (newJson) {
            example.schema = newJson as JsonSchema;
            // notify that the example was modified
            this.selectedExample.value = { ...example };
          }
        }
      }
    },
    reloadMonacoUiSchema() {
      const example = this.selectedExample.value;
      if (example) {
        this.monacoUiSchemaModel.value?.setValue(
          example.uischema ? JSON.stringify(example.uischema, null, 2) : ''
        );
      }
    },
    saveMonacoUiSchema() {
      const model = this.monacoUiSchemaModel.value;
      const example = this.selectedExample.value;

      if (model && example) {
        const modelValue = model.getValue();
        if (modelValue) {
          let newJson: Record<string, any> | undefined = undefined;

          try {
            newJson = JSON.parse(modelValue);
          } catch (error) {
            console.error('Invalid UISchema JSON: ' + error);
          }

          if (newJson) {
            example.uischema = newJson as UISchemaElement;
            // notify that the example was modified
            this.selectedExample.value = { ...example };
          }
        }
      }
    },
    reloadMonacoData() {
      const example = this.selectedExample.value;
      if (example) {
        this.monacoDataModel.value?.setValue(
          example.data ? JSON.stringify(example.data, null, 2) : ''
        );
      }
    },
    saveMonacoData() {
      const model = this.monacoDataModel.value;
      const example = this.selectedExample.value;

      if (model && example) {
        const modelValue = model.getValue();
        if (modelValue) {
          let newJson: Record<string, any> | undefined = undefined;

          try {
            newJson = JSON.parse(modelValue);
          } catch (error) {
            console.error('Invalid Data JSON: ' + error);
          }

          if (newJson) {
            example.data = newJson;
            // notify that the example was modified
            this.selectedExample.value = { ...example };
          }
        }
      }
    },
    registerValidatons(editor: EditorApi) {
      // register validation schemas
      for (let [index, example] of examples.entries()) {
        configureJsonSchemaValidation(
          editor,
          monaco.Uri.parse(this.toSchemaUri(`${index}`))
        );
        configureUISchemaValidation(
          editor,
          monaco.Uri.parse(this.toUiSchemaUri(`${index}`))
        );

        const schema = {
          ...example.input.schema,
          title: example.title,
        };

        if (example && example.input.schema) {
          configureDataValidation(
            editor,
            `inmemory://${this.toSchemaUri(index.toString())}`,
            monaco.Uri.parse(this.toDataUri(`${index}`)),
            schema
          );
        }
      }
    },
    toSchemaUri(id: string): string {
      return `${id}-schema.json`;
    },
    toUiSchemaUri(id: string): string {
      return `${id}-uischema.json`;
    },
    toDataUri(id: string): string {
      return `${id}-data.json`;
    },
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
});
</script>

<style scoped>
.form {
  max-width: 500px;
  flex: 1;
}
.container {
  display: flex;
}
.data {
  flex: 1;
}

.demo {
  max-width: 900px;
}
</style>

<style scoped>
/* required class */
.code-editor {
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

.vue-code-hightlight pre {
  background-color: transparent !important;
}

.vue-code-hightlight pre code {
  background-color: transparent !important;
}
</style>
