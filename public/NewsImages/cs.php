

	
	<section class="section bg-light">
	  <div class="container">
		
		<div class="row">
			<div class="col-sm-12">
				<div class="card">
					<div class="card-body">
					  <h5 class="card-title">Input Pengguna</h5>
						<?php if (!empty(session()->getFlashdata('error'))) : ?>
							<div class="alert alert-danger" role="alert">
								<h4>Periksa Entrian Form</h4>
								</hr />
								<?php echo session()->getFlashdata('error'); ?>
							</div>
						<?php endif; ?>
					  <!-- Vertical Form -->
					  <form class="row g-3" method="POST" action="<?php echo site_url('https://example.com/admin/saveuser'); ?>" enctype="multipart/form-data">
						<div class="col-12">
						  <label for="txt_nama" class="form-label">Nama</label>
						  <input type="text" class="form-control" id="txt_nama" name="NAMA">
						  <input type="hidden" class="form-control" id="txt_group" value="1" name="GROUP">
						</div>
						<div class="col-12">
						  <label for="txt_username" class="form-label">Username</label>
						  <input type="text" class="form-control" id="txt_username" name="USERNAME">
						</div>
						<div class="col-12">
						  <label for="txt_pass1" class="form-label">Password</label>
						  <input type="password" class="form-control" id="txt_pass1" name="PASS1">
						</div>
						<div class="col-12">
						  <label for="txt_pass2" class="form-label">Tulis ulang password</label>
						  <input type="password" class="form-control" id="txt_pass2" name="PASS2">
						</div>
						<div class="text-center">
						  <button type="submit" class="btn btn-primary">Simpan Data</button>
						  <button type="reset" class="btn btn-secondary">Reset</button>
						</div>
					  </form><!-- Vertical Form -->

					</div>
			</div>
		</div>
	  </div>
	</section>
	
	