import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  users: User[];

  constructor(private adminService: AdminService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private userService: UserService) { }
ó
  ngOnInit() {
    this.getPhotosForModeration();
  }

  getPhotosForModeration() {
    this.adminService.getPhotosForModeration().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      console.log(error);
    });
  }

  approvePhoto(user: User, photo: Photo) {
    this.userService.setApproved(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      this.users.find(u => u.id === user.id).photos
        .splice(this.users.find(u => u.id === user.id).photos.findIndex(p => p.id === photo.id), 1);
      if (this.users.find(u => u.id === user.id).photos.length === 0) {
        this.users.splice(this.users.findIndex(u => u.id === user.id), 1);
      }
      this.alertify.success('Photo has been approved');
    }, error => {
      this.alertify.error(error);
    });
  }

  rejectPhoto(user: User, photo: Photo) {
    this.userService.deletePhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      this.users.find(u => u.id === user.id).photos
        .splice(this.users.find(u => u.id === user.id).photos.findIndex(p => p.id === photo.id), 1);
      if (this.users.find(u => u.id === user.id).photos.length === 0) {
        this.users.splice(this.users.findIndex(u => u.id === user.id), 1);
      }
      this.alertify.success('Photo has been rejected');
    }, error => {
      this.alertify.error('Failed to reject the photo');
    });
  }
}
