<template>
  <v-dialog v-model="dialog" max-width="450px" scrollable>
    <v-card>
      <v-card-text>
        <div class="d-flex flex-column align-center">
          <h4>{{ $t("shareConnection.title") }}</h4>
          <v-alert type="warning" class="mt-4">
            <h4>{{ $t("shareConnection.description") }}</h4>
          </v-alert>
          <!-- host and global key -->
          <v-card class="w-100 ma-2 pa-4" variant="outlined">
            <div class="w-100">
              <p class="text-truncate">
                <v-icon start>mdi-link</v-icon> {{ connection.host }}
              </p>
              <p class="text-truncate">
                <v-icon start>mdi-key</v-icon> {{ connection.globalApiKey }}
              </p>
              <v-btn
                class="mt-4"
                color="primary"
                text
                @click="copy"
                :disabled="copied"
                block
              >
                <v-icon start>
                  mdi-{{ copied ? "check" : "content-copy" }}
                </v-icon>
                {{ $t("shareConnection.copy") }}
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false" :disabled="loading"> {{ $t("close") }} </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import copyToClipboard from "@/helpers/copyToClipboard";
export default {
  name: "SettingsModal",
  data: () => ({
    dialog: false,
    copied: false,
    connection: null,
  }),
  methods: {
    copy() {
      if (this.copied) return;
      const url = new URL(window.location.href);
      const connection = JSON.stringify(this.connection);
      const base64 = btoa(connection);
      url.searchParams.set("connection", base64);

      copyToClipboard(url.href);

      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    },
    open({ host, globalApiKey }) {
      this.dialog = true;
      this.connection = { host, globalApiKey };
    },
  },
};
</script>
