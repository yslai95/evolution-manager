<template>
  <v-card variant="outlined" :loading="loading">
    <v-card-title
      class="d-flex align-center"
      @click="toggleExpanded"
      style="cursor: pointer"
      v-ripple
    >
      <v-icon start>mdi-chat</v-icon>
      Chatwoot
      <v-spacer></v-spacer>
      <v-btn
        size="small"
        icon
        :disabled="loading"
        variant="tonal"
        @click.stop="toggleExpanded"
        :style="{ transform: expanded ? 'rotate(180deg)' : '' }"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="expanded">
      <v-alert v-if="error" type="error" class="mb-3">
        {{ error }}
      </v-alert>

      <v-form v-model="valid">
        <v-text-field
          v-model="chatwootData.url"
          label="URL"
          :disabled="loading"
          outlined
          dense
          hide-details="auto"
          class="mb-3"
          :rules="[
            (url) => {
              if (!url) return this.$t('required', { field: 'URL' });
              if (!url.startsWith('http'))
                return this.$t('httpHttps', { field: 'URL' });
              return true;
            },
          ]"
        />

        <div class="d-flex gap-4 flex-wrap">
          <div class="flex-grow-1">
            <v-text-field
              v-model="chatwootData.accountId"
              :label="$t('chatwoot.accountId')"
              :disabled="loading"
              outlined
              dense
              hide-details="auto"
              class="mb-3"
              :rules="[
                (accountId) => {
                  if (!accountId)
                    return this.$t('required', {
                      field: this.$t('chatwoot.accountId'),
                    });
                  return true;
                },
              ]"
            />
          </div>
          <div class="flex-grow-1">
            <v-text-field
              v-model="chatwootData.token"
              :label="$t('chatwoot.token')"
              :disabled="loading"
              outlined
              dense
              hide-details="auto"
              class="mb-3"
              :rules="[
                (token) => {
                  if (!token)
                    return this.$t('required', {
                      field: this.$t('chatwoot.token'),
                    });
                  return true;
                },
              ]"
            />
          </div>
          <div class="flex-grow-1">
            <v-text-field
              v-model.number="chatwootData.daysLimitImportMessages"
              :label="$t('chatwoot.dayslimitimportmessages')"
              :disabled="loading"
              outlined
              dense
              hide-details="auto"
              class="mb-3"
            />
          </div>
        </div>
        <div class="d-flex align-center gap-4 flex-wrap">
          <v-checkbox
            class="flex-grow-0 flex-shrink-0"
            v-model="chatwootData.signMsg"
            :disabled="loading"
            hide-details
            density="compact"
          >
            <template v-slot:label>
              <span>{{ $t("chatwoot.signMsg") }}</span>
              <HelpTooltip> {{ $t("chatwoot.signMsgHelp") }} </HelpTooltip>
            </template>
          </v-checkbox>
          <v-text-field
            class="flex-grow-1 flex-shrink-0"
            v-model="chatwootData.signDelimiter"
            :disabled="
              loading ||
              !chatwootData.signMsg ||
              !AppStore.versionSatisfies('>=1.6.1')
            "
            :label="$t('chatwoot.signDelimiter')"
            :hint="
              !AppStore.versionSatisfies('>=1.6.0')
                ? $t('version.availableFrom', { version: '1.6.1' })
                : $t('chatwoot.signDelimiterHelp')
            "
            :persistent-hint="!AppStore.versionSatisfies('>=1.6.1')"
            hide-details="auto"
            placeholder="\n"
            style="min-width: 200px"
          ></v-text-field>
        </div>

        <div class="d-flex gap-x-4 flex-wrap">
          <div>
            <v-checkbox
              v-model="chatwootData.reopenConversation"
              :disabled="loading"
              hide-details
              class="mb-3"
              density="compact"
            >
              <template v-slot:label>
                <span>{{ $t("chatwoot.reopenConversation") }}</span>
                <HelpTooltip>
                  {{ $t("chatwoot.reopenConversationHelp") }}
                </HelpTooltip>
              </template>
            </v-checkbox>
          </div>

          <div>
            <v-checkbox
              v-model="chatwootData.conversationPending"
              :disabled="loading"
              hide-details
              class="mb-3"
              density="compact"
            >
              <template v-slot:label>
                <span>{{ $t("chatwoot.conversationPending") }}</span>
                <HelpTooltip>
                  {{ $t("chatwoot.conversationPendingHelp") }}
                </HelpTooltip>
              </template>
            </v-checkbox>
          </div>
          <div>
            <v-checkbox
              v-model="chatwootData.importContacts"
              hide-details="auto"
              class="mb-3"
              density="compact"
              :disabled="loading || !AppStore.versionSatisfies('>=1.7.0')"
              :hint="
                !AppStore.versionSatisfies('>=1.7.0')
                  ? $t('version.availableFrom', { version: '1.7.0' })
                  : undefined
              "
              :persistent-hint="!AppStore.versionSatisfies('>=1.7.0')"
            >
              <template v-slot:label>
                <span>{{ $t("chatwoot.importcontacts") }}</span>
                <HelpTooltip>
                  {{ $t("chatwoot.importcontactsHelp") }}
                </HelpTooltip>
              </template>
            </v-checkbox>
          </div>

          <div>
            <v-checkbox
              v-model="chatwootData.importMessages"
              hide-details="auto"
              class="mb-3"
              density="compact"
              :disabled="loading || !AppStore.versionSatisfies('>=1.7.0')"
              :hint="
                !AppStore.versionSatisfies('>=1.7.0')
                  ? $t('version.availableFrom', { version: '1.7.0' })
                  : undefined
              "
              :persistent-hint="!AppStore.versionSatisfies('>=1.7.0')"
            >
              <template v-slot:label>
                <span>{{ $t("chatwoot.importmessages") }}</span>
                <HelpTooltip>
                  {{ $t("chatwoot.importmessagesHelp") }}
                </HelpTooltip>
              </template>
            </v-checkbox>
          </div>

          <div>
            <v-checkbox
              v-model="chatwootData.auto_create"
              :disabled="loading || !AppStore.versionSatisfies('>=1.6.0')"
              :hint="
                !AppStore.versionSatisfies('>=1.6.0')
                  ? $t('version.availableFrom', { version: '1.6.0' })
                  : undefined
              "
              :persistent-hint="!AppStore.versionSatisfies('>=1.6.0')"
              hide-details="auto"
              class="mb-3"
              density="compact"
            >
              <template v-slot:label>
                <span>{{ $t("chatwoot.autoCreate") }}</span>
                <HelpTooltip>{{ $t("chatwoot.autoCreateHelp") }}</HelpTooltip>
              </template>
            </v-checkbox>
          </div>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions v-if="expanded" class="d-flex flex-wrap gap-x-1">
      <v-switch
        v-model="chatwootData.enabled"
        :label="$t('enabled')"
        color="primary"
        :disabled="loading"
        hide-details
      ></v-switch>
      <v-btn variant="text" @click="chatwootConfig" size="small">
        {{ $t("chatwoot.config.btn") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="
          !valid ||
          JSON.stringify(chatwootData) === JSON.stringify(defaultChatwootData)
        "
        :loading="loading"
        color="primary"
        @click="saveChatwoot"
        variant="tonal"
      >
        {{ $t("save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
  <chatwoot-config :instance="instance" ref="chatwootConfig" />
</template>

<script>
import ChatwootConfig from "@/components/modal/ChatwootConfig.vue";
import instanceController from "@/services/instanceController";
import { useAppStore } from "@/store/app";
const defaultObj = () => ({
  enabled: false,
  url: "",
  accountId: "",
  token: "",
  signMsg: true,
  signDelimiter: "\n",
  reopenConversation: true,
  conversationPending: false,
  auto_create: undefined,
  importContacts: false,
  importMessages: false,
  daysLimitImportMessages: 0,
});

export default {
  name: "InstanceChatwoot",
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    expanded: false,
    loading: false,
    error: false,
    valid: false,
    AppStore: useAppStore(),
    chatwootData: {
      enabled: false,
      url: "",
      accountId: "",
      token: "",
      signMsg: true,
      signDelimiter: "\n",
      reopenConversation: true,
      conversationPending: false,
      importContacts: false,
      importMessages: false,
      daysLimitImportMessages: 0,
    },
    defaultChatwootData: {
      enabled: false,
      url: "",
      accountId: "",
      token: "",
      signMsg: true,
      signDelimiter: "\n",
      reopenConversation: true,
      conversationPending: false,
      importContacts: false,
      importMessages: false,
      days_limit_importMessages: 0,
    },
  }),
  methods: {
    toggleExpanded() {
      if (this.loading) return;
      this.expanded = !this.expanded;
    },
    chatwootConfig() {
      this.$refs.chatwootConfig.open();
    },
    async saveChatwoot() {
      try {
        this.loading = true;
        this.error = false;
        await instanceController.chatwoot.set(
          this.instance.name,
          {
            ...this.chatwootData,
            url: this.chatwootData.url.trim().replace(/\/$/, ""),
          }
        );
        this.defaultChatwootData = Object.assign({}, this.chatwootData);
      } catch (e) {
        this.error = e.message?.message || e.message || e;
      } finally {
        this.loading = false;
      }
    },
    async loadChatwoot() {
      try {
        this.loading = true;
        this.error = false;
        const chatwootData = await instanceController.chatwoot.get(
          this.instance.name
        );

        const validData = chatwootData._doc || chatwootData;

        this.chatwootData = Object.assign(defaultObj(), validData || {});
        this.defaultChatwootData = Object.assign(defaultObj(), validData || {});
      } catch (e) {
        this.error = e.message?.message || e.message || e;
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    expanded(expanded) {
      if (expanded) this.loadChatwoot();
    },
  },
  components: { ChatwootConfig },
};
</script>

<style></style>
